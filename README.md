# ✿ Paracosm

<p align="center">
  <img src="public/icons/icon-512.png" width="100" alt="Paracosm app icon" />
</p>

<h3 align="center">All your worlds. One little place.</h3>

<p align="center">
  A personal media archive to collect, organize, track, and revisit everything you love.
</p>

<p align="center">
  <a href="https://github.com/manasvinaik/Paracosm">GitHub Repository</a>
  ·
  <a href="YOUR_LIVE_DEMO_URL">Live Demo</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/PWA-ready-D9A5C5?style=flat-square" />
</p>

---

## ♡ About

**Paracosm** is a personal media management application designed to bring all your fictional worlds into one little home.

Whether it's books, movies, TV shows, anime, manga, fanfiction, or other media, Paracosm gives you a space to archive your favourites, organize collections, track your progress, and keep personal notes.

Think of it as your own little corner of the internet dedicated to everything you love.

## ✧ Features

- **Personal Media Archive** — Add, edit, and organize media across multiple categories.
- **Metadata Search** — Find and import media details and cover artwork through external APIs.
- **Collections & Shelves** — Create custom collections to organize your archive.
- **Progress Tracker** — Keep track of what you're reading, watching, playing, or have completed.
- **Personal Notes** — Save your thoughts and notes about individual media entries.
- **Statistics Dashboard** — Visualize your archive and activity.
- **Activity Timeline** — Revisit your media journey.
- **Progressive Web App** — Install Paracosm on supported devices.

## ⊹ Screenshots

<p align="center"><strong>01 · First impressions</strong></p>

<table>
  <tr>
    <td align="center">
      <img src="screenshots/%231%20Landing-1.png" width="220" alt="Landing page" />
      <br/><sub>Landing Page</sub>
    </td>
    <td align="center">
      <img src="screenshots/%232%20Landing-2.png" width="220" alt="Landing page features" />
      <br/><sub>Explore Paracosm</sub>
    </td>
    <td align="center">
      <img src="screenshots/%233%20SignUp.png" width="220" alt="Sign up page" />
      <br/><sub>Sign Up</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="screenshots/%234%20Login.png" width="220" alt="Login page" />
      <br/><sub>Login</sub>
    </td>
  </tr>
</table>

<p align="center"><strong>02 · Your personal archive</strong></p>

<table>
  <tr>
    <td align="center">
      <img src="screenshots/%235%20Dashboard-1.png" width="220" alt="Dashboard overview" />
      <br/><sub>Dashboard</sub>
    </td>
    <td align="center">
      <img src="screenshots/%236%20Dashboard-2.png" width="220" alt="Dashboard media overview" />
      <br/><sub>Media Overview</sub>
    </td>
    <td align="center">
      <img src="screenshots/%237%20AllMediaPage.png" width="220" alt="All media page" />
      <br/><sub>All Media</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="screenshots/%238%20AnimePage.png" width="220" alt="Anime collection" />
      <br/><sub>Anime</sub>
    </td>
    <td align="center">
      <img src="screenshots/%239%20MangaPage.png" width="220" alt="Manga collection" />
      <br/><sub>Manga</sub>
    </td>
    <td align="center">
      <img src="screenshots/%2310%20ItemDetails.png" width="220" alt="Media item details" />
      <br/><sub>Item Details</sub>
    </td>
  </tr>
</table>

<p align="center"><strong>03 · Build your collection</strong></p>

<table>
  <tr>
    <td align="center">
      <img src="screenshots/%2311%20AddMediaPage.png" width="220" alt="Add media page" />
      <br/><sub>Add Media</sub>
    </td>
    <td align="center">
      <img src="screenshots/%2312%20ImportedDetails.png" width="220" alt="Imported media details" />
      <br/><sub>Imported Details</sub>
    </td>
    <td align="center">
      <img src="screenshots/%2313%20CollectionsPage.png" width="220" alt="Collections and shelves" />
      <br/><sub>Collections & Shelves</sub>
    </td>
  </tr>
</table>

<p align="center"><strong>04 · Your media journey</strong></p>

<table>
  <tr>
    <td align="center">
      <img src="screenshots/%2314%20ProgressTracker.png" width="220" alt="Progress tracker" />
      <br/><sub>Progress Tracker</sub>
    </td>
    <td align="center">
      <img src="screenshots/%2315%20StatisticsPage.png" width="220" alt="Statistics dashboard" />
      <br/><sub>Statistics</sub>
    </td>
    <td align="center">
      <img src="screenshots/%2316%20ActivityPage.png" width="220" alt="Activity timeline" />
      <br/><sub>Activity Timeline</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="screenshots/%2317%20SettingsPage.png" width="220" alt="Settings page" />
      <br/><sub>Settings</sub>
    </td>
  </tr>
</table>

## ⚙️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend UI |
| Vite | Development and build tooling |
| Supabase | Database and authentication |
| JavaScript | Application logic |
| CSS | Styling and responsive layouts |
| Vite PWA Plugin | PWA support |

### External APIs

- [AniList API](https://anilist.gitbook.io/anilist-apiv2-docs/) — Anime and manga metadata.
- [TMDB API](https://developer.themoviedb.org/docs) — Movie and TV metadata.
- [Open Library API](https://openlibrary.org/developers/api) — Book metadata and covers.
- [Comick Source API](https://comick-source-api.notaspider.dev/) — Manga search.

## ♡ Installation

Want to run Paracosm locally? Follow these steps.

### 1. Clone the repository

```bash
git clone https://github.com/manasvinaik/Paracosm.git
cd Paracosm
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Add any other environment variables required by your local configuration.

### 4. Set up Supabase

- Create a project on [Supabase](https://supabase.com/).
- Configure the database tables and authentication.
- Add the appropriate Row Level Security policies.
- Copy your project URL and anon/publishable key into `.env`.

### 5. Start the development server

```bash
npm run dev
```

Open the local URL provided by Vite, usually:

```text
http://localhost:5173
```

### 6. Build for production

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## ✿ Project Status

Paracosm is an ongoing personal project, built to make keeping track of fictional worlds a little more fun.

---

<p align="center">
  Made with ♡ and a love for stories.
  <br/>
  <sub>Paracosm · Your worlds, your little archive.</sub>
</p>
