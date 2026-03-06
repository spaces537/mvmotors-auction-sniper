# 🚗 MVMotors Auction Sniper

Belgian Car Auction Aggregator & Sniper Dashboard

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)

## 🎯 Features

- **Real-time Auction Feed** - Live data from Belgian car auction platforms
- **Live Countdown Timers** - Never miss an auction ending
- **Smart Filtering** - Search by make, model, year, price, source
- **Price Alerts** - Get notified when cars match your criteria
- **Responsive Design** - Works on desktop & mobile
- **MVMotors Branding** - Yellow/black professional theme

## 📊 Data Sources

| Source | Status | Notes |
|--------|--------|-------|
| 2dehands.be | ✅ Live | Real-time scraping |
| Autorola | 🎭 Demo | Requires B2B login |
| VWE | 🎭 Demo | Requires B2B login |
| Adesa | 🎭 Demo | Requires B2B login |

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## 🌐 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/spaces537/mvmotors-auction-sniper)

1. Click the button above, or:
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import this repository
4. Click Deploy

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Date Utils:** date-fns

## 📁 Project Structure

```
auction-sniper/
├── src/
│   ├── app/
│   │   ├── api/auctions/    # API routes
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Main dashboard
│   ├── components/
│   │   ├── Header.tsx       # Top navigation
│   │   ├── StatsBar.tsx     # Statistics cards
│   │   ├── FilterBar.tsx    # Search & filters
│   │   ├── AuctionGrid.tsx  # Car grid layout
│   │   ├── AuctionCard.tsx  # Individual car card
│   │   └── AlertsPanel.tsx  # Price alerts sidebar
│   ├── lib/
│   │   └── scrapers/        # Data scrapers
│   └── types/
│       └── auction.ts       # TypeScript types
├── scraper/                  # Python scrapers (optional)
└── public/                   # Static assets
```

## 🔧 Configuration

### Adding Real Auction Sources

To enable real data from Autorola, VWE, or Adesa:

1. Obtain B2B API credentials from the auction platform
2. Add credentials to environment variables
3. Update the scraper in `src/lib/scrapers/`

```env
AUTOROLA_API_KEY=your_key_here
VWE_USERNAME=your_username
VWE_PASSWORD=your_password
```

## 📸 Screenshots

### Dashboard
- Yellow/black MVMotors theme
- Live countdown timers (red = urgent)
- Stats overview (total, filtered, ending soon)

### Features
- 🔍 Search by make, model, keywords
- 📊 Filter by price, year, source
- ⏰ Sort by ending time, price, year
- 🔔 Set price alerts for specific criteria

## 🤝 Contributing

Pull requests welcome! For major changes, please open an issue first.

## 📄 License

MIT

---

Built with ⚡ by [MVMotors](https://mvmotors.be)
