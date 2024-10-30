# Energy Price Tracker for Raycast

This extension displays hourly energy prices (electricity and gas) in the Raycast menu bar. You can view both wholesale and all-in prices, customize various settings, and check upcoming hourly electricity prices and the current daily gas price.

## Features

- Displays the current hourly electricity and daily gas prices in the Raycast menu bar
- Option to calculate either wholesale or all-in prices based on user settings
- Hourly API updates to ensure accurate, up-to-date pricing
- Displays additional hourly electricity prices based on configurable extra hours
- Supports VAT, surcharges, and energy tax customization for accurate all-in pricing

## Installation

1. Clone or download this repository.
2. Install the dependencies:
   ```bash npm install```
3. Run the extension in development mode:
   ```npm run dev```

## Configuration

The extension includes the following configurable settings:

	•	All-in Prices (inkoop_allin): Set to true for all-in price calculations, false for wholesale prices only.
	•	Gas Surcharge (opslag_gas): Default is 0.05911
	•	Gas Energy Tax (eb_gas): Default is 0.58301
	•	Electricity Surcharge (opslag_stroom): Default is 0.04844
	•	Electricity Energy Tax (eb_stroom): Default is 0.1088
	•	VAT (btw): Default is 21%
	•	Additional Hours (extra_uren): Number of additional hours of electricity prices to display. Default is 6
	•	Decimal Places (aantal_decimalen): Sets the number of decimal places for displayed prices. Default is 3

## How It Works

The extension fetches wholesale energy prices once per hour from the EnergyZero API and calculates either the wholesale or all-in price based on user settings. Prices are displayed in the Raycast menu bar as follows:

💡€[Electricity Price] | 🔥€[Gas Price]

Clicking on the displayed prices opens a modal showing additional hourly electricity prices and the daily gas price.

## Example Menu

For example, with an extra_uren setting of 6, the modal might display:

10:00  💡€0.342
11:00  💡€0.333
12:00  💡€0.352
13:00  💡€0.365
14:00  💡€0.322
15:00  💡€0.335
Daily  🔥€0.671

## API

The extension uses the EnergyZero API to retrieve current wholesale prices. Please note:

	•	Gas: usageType=3
	•	Electricity: usageType=1

## Author

	•	Theo van der Sluijs
	•	GitHub
	•	Website

In his spare time, Theo builds hay steamers and enjoys discussing Python, energy, climate, AI, and tech.

## License

MIT License. See LICENSE for details.
