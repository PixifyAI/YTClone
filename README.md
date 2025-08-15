# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

---

## AIflix Setup

This project is configured to work with the YouTube Data API to fetch videos for the AIflix platform. To run this project, you will need to provide a YouTube API key.

### Vercel Deployment

If you are deploying this project to Vercel, you need to set the `VITE_YOUTUBE_API_KEY` environment variable in your Vercel project settings.

**Security Warning:** This method will expose your YouTube API key in the frontend code of your deployed site. This is not a secure practice. It is highly recommended to use a backend proxy or serverless function to protect your API key.

1.  Go to your project's dashboard on Vercel.
2.  Navigate to the "Settings" tab.
3.  Click on "Environment Variables" in the left sidebar.
4.  Add a new environment variable with the key `VITE_YOUTUBE_API_KEY` and paste your YouTube Data API key as the value.
5.  Redeploy your project for the changes to take effect.

### Local Development

For local development, create a file named `.env` in the root of the project and add the following line:

```
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
```

The `.env` file is included in `.gitignore` and will not be committed to the repository.

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
