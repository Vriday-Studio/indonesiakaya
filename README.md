# React + Vite

This APP is for AR Image Tracking

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Firebase env vars
- Required keys are listed in `.env.example`; copy it to `.env.local` for local dev.
- Do **not** commit real keys. In Netlify, set `VITE_FIREBASE_*` in Site settings → Build & deploy → Environment. (Firebase web API keys are public by design, but keeping them out of the repo avoids secret-scanner noise.)
