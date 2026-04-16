# LumajangNews

Portal berita online yang menyajikan informasi terkini dari Kabupaten Lumajang, Jawa Timur.

## Fitur

- **Beranda** - Headline carousel dengan berita terbaru
- **Kategori** - 8 kategori berita (Politik, Ekonomi, Hukum & Kriminal, Peristiwa, dll)
- **Detail Berita** - Halaman artikel dengan berita terkait di sidebar
- **Pencarian** - Cari berita berdasarkan kata kunci
- **Halaman Statis** - Profil, Redaksi, Pedoman Media, Kontak, Disclaimer
- **Dark Mode** - Toggle tema gelap/terang

## Tech Stack

**Frontend:**
- React + TypeScript
- Vite
- React Router
- Lucide Icons
- CSS Variables (Dark Mode)

**Backend:**
- Node.js + Express
- Cheerio (Web Scraper)
- NodeCache (Caching)

## Cara Menjalankan

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
npm install
npm run dev
# Server berjalan di http://localhost:3000
```

### Environment Variables

Buat file `.env` di root:

```env
PORT=3000
BASE_URL=https://lumajangsatu.com/
```

## Struktur Project

```
├── frontend/          # React Frontend
│   ├── src/
│   │   ├── components/   # UI Components
│   │   ├── pages/        # Halaman
│   │   ├── services/     # API Services
│   │   ├── contexts/     # React Context
│   │   └── styles/       # Global Styles
│   └── ...
├── src/              # Node.js Backend
│   ├── routes/       # API Routes
│   ├── services/     # Scraper Service
│   └── utils/        # Utilities
└── ...
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/latest` | Berita terbaru |
| `GET /api/category/:slug` | Berita per kategori |
| `GET /api/article/:slug` | Detail artikel |
| `GET /api/search?q=` | Pencarian berita |
| `GET /api/categories` | Daftar kategori |

## Deploy

### Frontend (Vercel)

```bash
cd frontend
npm run build
# Upload dist folder ke Vercel
```

### Backend (Railway/Render)

```bash
# Connect repo ke Railway/Render
# Set environment variables
npm start
```

## Lisensi

MIT License
