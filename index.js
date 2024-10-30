import { useEffect, useState } from "react";
import { List, Action, ActionPanel, Detail, showToast, Toast } from "@raycast/api";

// Configuraties voor API
const API_URL = "https://api.energyzero.nl/v1/energyprices";
const GASTYPE = 3;
const ELECTRICITYTYPE = 1;

// Variabelen uit de instellingen
const settings = {
  inkoop_allin: true,
  opslag_gas: 0.05911,
  eb_gas: 0.58301,
  opslag_stroom: 0.04844,
  eb_stroom: 0.1088,
  btw: 21,
  extra_uren: 6,
  aantal_decimalen: 3,
};

export default function Command() {
  const [prices, setPrices] = useState({ gas: null, electricity: [] });
  const [currentGasPrice, setCurrentGasPrice] = useState(null);
  const [currentElectricityPrice, setCurrentElectricityPrice] = useState(null);

  // Laad de prijzen bij het openen van de extensie
  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60 * 60 * 1000); // Update elke uur
    return () => clearInterval(interval);
  }, []);

  // Functie om de prijzen op te halen
  async function fetchPrices() {
    try {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      const fromDate = `${yesterday.toISOString().split("T")[0]}T23:00:00+00:00`;
      const tillDate = `${today.toISOString().split("T")[0]}T22:59:59+00:00`;

      // Stroomprijzen ophalen
      const electricityData = await fetchPriceData(ELECTRICITYTYPE, fromDate, tillDate);
      const gasData = await fetchPriceData(GASTYPE, fromDate, tillDate);

      // Opslaan van huidige prijzen
      setPrices({ gas: gasData, electricity: electricityData });
      setCurrentElectricityPrice(calculatePrice(electricityData[0]?.price, "stroom"));
      setCurrentGasPrice(calculatePrice(gasData[0]?.price, "gas"));
    } catch (error) {
      console.error("Fout bij het ophalen van prijzen:", error);
      showToast(Toast.Style.Failure, "Error", "Could not fetch prices. Trying again in an hour.");
    }
  }

  // Helperfunctie om de API-oproep te maken
  async function fetchPriceData(usageType, fromDate, tillDate) {
    const url = `${API_URL}?&fromDate=${fromDate}&tillDate=${tillDate}&interval=4&usageType=${usageType}&inclBtw=false`;
    const response = await fetch(url);
    const data = await response.json();
    return data?.Prices || [];
  }

  // Prijsberekening op basis van instellingen
  function calculatePrice(basePrice, type) {
    if (!settings.inkoop_allin) return basePrice.toFixed(settings.aantal_decimalen);

    const opslag = type === "gas" ? settings.opslag_gas : settings.opslag_stroom;
    const eb = type === "gas" ? settings.eb_gas : settings.eb_stroom;
    const btwMultiplier = 1 + settings.btw / 100;

    return ((basePrice + opslag + eb) * btwMultiplier).toFixed(settings.aantal_decimalen);
  }

  return (
    <List>
      <List.Item
        title={`💡 €${currentElectricityPrice} | 🔥 €${currentGasPrice}`}
        actions={
          <ActionPanel>
            <Action
              title="Show Price Details"
              onAction={() => {
                showToast(Toast.Style.Success, "Prijsdetails", `Stroom: €${currentElectricityPrice} | Gas: €${currentGasPrice}`);
              }}
            />
          </ActionPanel>
        }
      />
      {prices.electricity.slice(0, settings.extra_uren).map((price, index) => (
        <List.Item
          key={index}
          title={`${new Date(price.readingDate).getHours()}:00`}
          subtitle={`💡 €${calculatePrice(price.price, "stroom")}`}
        />
      ))}
      <List.Item title={`🔥 Dagprijs: €${currentGasPrice}`} />
    </List>
  );
}
