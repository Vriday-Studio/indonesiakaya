# React + Vite

This APP is for AR Image Tracking

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Firebase env vars
- Required keys are listed in `.env.example`; copy it to `.env.local` for local dev.
- Netlify deployments read the same values from `netlify.toml` (`VITE_FIREBASE_*`). If you rotate Firebase keys, update both `.env.example` and `netlify.toml` to keep builds healthy.
