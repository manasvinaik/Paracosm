<<<<<<< HEAD
# Paracosm — Frontend starter v0.2

Pastel retro-pixel media archive built with React + Vite. This is a frontend-only prototype with demo data and localStorage persistence. It is not real authentication and has no backend yet.

## Run locally
```bash
npm install
npm run dev
```
Open the localhost URL printed by Vite.

## Build
```bash
npm run build
npm run preview
```

## Pages and routes
| Route | Page |
|---|---|
| `/` | Landing |
| `/login` | Demo login |
| `/signup` | Demo signup |
| `/forgot-password` | Demo password recovery |
| `/dashboard` | Dashboard |
| `/library` | All media |
| `/library/books` | Books |
| `/library/movies` | Movies |
| `/library/tv-shows` | TV shows |
| `/library/fanfictions` | Fanfictions |
| `/media/add` | Add media |
| `/media/:id` | Media details |
| `/media/:id/edit` | Edit media |
| `/collections` | Collections |
| `/collections/:id` | Collection details |
| `/tracking` | Progress tracker |
| `/statistics` | Statistics |
| `/activity` | Activity timeline |
| `/settings` | Settings |
| `/settings/themes` | Theme studio |
| `/settings/profile` | Profile settings |
| `/settings/library` | Library preferences |
| `/settings/import-export` | JSON / CSV export |
| `/settings/account` | Account and privacy |

## Demo behaviour
- Enter any email and password on `/login` to open the dashboard.
- `/signup` provides a frontend-only demo registration flow.
- `/forgot-password` previews the password recovery experience; it does not send email.
- Use Log out in the sidebar to clear the demo session and return to login.
- Add and edit media using the forms.
- Media entries are stored in browser `localStorage` for the demo.
- JSON and CSV export download the current demo library.
- Theme preset selection is stored in `localStorage`.
- Collection and universe creation is currently in page state only.
- Search-provider buttons show demo results; no external APIs are connected.

## Important before backend integration
The demo login is not secure authentication. Do not use it for real users or sensitive data. Replace it with Supabase Auth, move media and preferences to PostgreSQL, add Row Level Security, and use private Supabase Storage for user-uploaded covers.

## Stack
- React + Vite (JavaScript)
- React Router
- Lucide React
- CSS variables and responsive CSS
- Browser localStorage for prototype data

## Supabase connection

1. Install dependencies with `npm install` (this project includes `@supabase/supabase-js`).
2. Copy `.env.example` to `.env.local`.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local` using your Supabase project's Connect panel.
4. Start the app with `npm run dev`.

Never put your Supabase service-role/secret key in a Vite environment variable. Only use the publishable key in the browser, and keep Row Level Security enabled on private tables.

The Supabase client is exported from `src/lib/supabaseClient.js`. This adds the connection configuration; the current demo library and demo auth screens have not yet been migrated to Supabase operations.


## ✨ Metadata API setup

Paracosm can search TMDB for movies and TV shows, and AniList for anime. Follow [API_SETUP.md](./API_SETUP.md) to configure and deploy the TMDB Supabase Edge Function. AniList public search does not require an API key.
=======
# ✦ PARACOSM ✦
### your little universe of stories, memories & media.

<p align="center">
  <img src="https://img.shields.io/badge/STATUS-IN%20DEVELOPMENT-F2A7BB?style=flat-square" />
  <img src="https://img.shields.io/badge/BUILT%20WITH-REACT-9BCFC3?style=flat-square" />
  <img src="https://img.shields.io/badge/POWERED%20BY-SUPABASE-A8C9C0?style=flat-square" />
  <img src="https://img.shields.io/badge/MADE%20WITH-♡-E9B8C8?style=flat-square" />
</p>

<p align="center">
  <i>A personal media archive for everything you read, watch, play, and love.</i>
</p>

## 🌷 what is paracosm?

**Paracosm** is a personal media library designed to give all your favourite things a home.

Books you've read, movies that stayed with you, shows you're currently bingeing, fanfictions you can't stop thinking about, games you've played, and stories you haven't quite finished yet — Paracosm brings them all together in one cozy, organised space.

It's your own little corner of the internet to document your interests, collect your favourites, keep personal notes, and look back at everything you've experienced.

## 🍓 what can you do here?

| Feature | Description |
|:--|:--|
| 📚 **Your Media Library** | Keep track of books, movies, TV shows, anime, manga, manhwa, fanfictions, webnovels, articles, board games, and more. |
| ✎ **Personal Notebook** | Write down thoughts, reviews, reactions, and little memories attached to each entry. |
| ⭐ **Ratings & Progress** | Rate your experiences and track what you're currently enjoying, have completed, or want to explore. |
| 🎀 **Collections & Shelves** | Organise your media into personalised collections and themed shelves. |
| 📊 **Your Statistics** | Get a glimpse into your media habits, favourite categories, and activity. |
| 🔎 **Search & Discover** | Find entries in your personal archive without scrolling endlessly. |
| 👤 **Personal Profiles** | Maintain your own account and private media library. |

## 🧸 the aesthetic

Paracosm follows a **Pixel Dream** visual direction — a little retro, a little whimsical, and very much inspired by the charm of pastel retro digital spaces.

The visual language is built around:

- 🌸 Soft pastel pinks
- 🍃 Muted mint greens
- 🫧 Creamy, warm neutrals
- 🩵 Gentle green-blue accents
- ✧ Pixel-inspired details and nostalgic UI elements

The goal is to make organising your media feel less like managing a spreadsheet and more like decorating your own little digital world.

## 🌱 running locally

Want to explore the project or run your own instance?

**1. Clone the repository**

```bash
git clone https://github.com/manasvinaik/Paracosm.git
cd Paracosm
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

You'll need a Supabase project with the required database tables and Row Level Security policies configured.

**4. Start the development server**

```bash
npm run dev
```

And you're ready to go! ♡

## 💌 a little note

Paracosm was created out of a love for stories, media, and keeping track of the little things that make life interesting.

It's a space for the things you loved, the things you're loving, and everything you haven't discovered yet. You are a museum of the things you've loved, afterall.

---

<p align="center">
  <sub>made with ♡ by MANASVI NAIK © 2026</sub>
</p>
>>>>>>> 5d050b94f5e6a0cde40183f9a3973b17b4bc73e2
