# Unwrap AI Extension - Developer Guide

This directory contains the source code for the Unwrap AI Chrome extension.

## 🛠️ Setup & Development

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development build (watch mode):
   ```bash
   npm run build:watch
   ```
   This will compile the extension to the `dist/` folder and watch for file changes.

### Loading in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `dist` folder inside this directory (`unwrap-ai/dist`)

You can now use the extension! If you make changes to the code, the build script will automatically update the `dist` folder. You may need to click the refresh icon on the extension card in `chrome://extensions/` to see changes.

## 🏗️ Project Structure

- **`src/`** - Main source code (React app)
- **`src/background/`** - Service worker (background logic)
- **`src/content/`** - Content scripts (injected into webpages)
- **`manifest.json`** - Extension configuration

## 📦 Building for Production

To create a production-ready build:

```bash
npm run build
```

Then zip the contents of the `dist/` folder to publish to the Chrome Web Store.
