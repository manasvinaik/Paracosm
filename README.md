# Paracosm

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
