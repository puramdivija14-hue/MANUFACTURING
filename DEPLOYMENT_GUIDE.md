# 🚀 ManuGenius AI — Production Deployment Guide

Deploy **ManuGenius AI** to a worldwide public URL so anyone (students, engineers, professors, hackathon judges, startup founders) can use it on any device.

---

## ⚡ Option 1: Deploy to Vercel (Recommended — 60 Seconds, Free)

Vercel provides the fastest global CDN, automatic SSL certificates (HTTPS), and zero-configuration setup for Vite + React.

### Method A: Direct Command-Line Deploy (No GitHub needed)
Open your terminal in `c:\Users\divij\OneDrive\Desktop\manufacturing` and run:
```bash
npx vercel
```
1. Follow the 3 prompts:
   - *Set up and deploy?* Press **Y**
   - *Which scope?* Select your account
   - *Link to existing project?* **N**
   - *Project name?* `manugenius-ai`
   - *In which directory is your code located?* Press **Enter** (for `./`)
2. Within 30 seconds, Vercel will give you a live production link:
   👉 **`https://manugenius-ai.vercel.app`**

### Method B: Via GitHub Repository
1. Initialize Git and commit your code:
   ```bash
   git init
   git add .
   git commit -m "Initial release of ManuGenius AI"
   ```
2. Create a new repository on [github.com/new](https://github.com/new) and push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/manugenius-ai.git
   git branch -M main
   git push -u origin main
   ```
3. Go to [vercel.com/new](https://vercel.com/new), select **Import Repository**, and click **Deploy**.
   *(Vercel automatically detects the `vercel.json` and builds `dist/` instantly).*

---

## 🌐 Option 2: Deploy to Netlify (Free — Drag & Drop or Git)

### Method A: 10-Second Drag & Drop
1. Build the production folder locally:
   ```bash
   npm run build
   ```
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag and drop the generated `dist` folder directly onto the page.
4. Netlify will instantly generate a live URL like `https://manugenius-ai.netlify.app`.
   *(The `public/_redirects` file is already in place to ensure seamless page navigation).*

---

## ⚙️ Environment Variables (Optional)

ManuGenius AI features a **Dual-Engine Architecture**:
1. **Built-in Domain Heuristic Engine**: Works 100% offline with zero configuration and zero API keys!
2. **Google Gemini Live AI**: Users can plug in their own key in Settings (`⚙️`).
3. *(Optional)* If you want to supply a shared default Gemini API key for everyone visiting your site without them needing their own key, add this in your Vercel or Netlify Project Settings:
   - **Key**: `VITE_GEMINI_API_KEY`
   - **Value**: `Your_Gemini_API_Key_From_Google_AI_Studio`

---

## 🛡️ Production Optimizations Included

* ✅ **Single Page App Routing**: `vercel.json` and `public/_redirects` configured for zero-404 refreshes.
* ✅ **SEO & Social Cards**: Rich Open Graph & Twitter meta tags for WhatsApp, LinkedIn, Discord, and X previews.
* ✅ **Printable Reports**: Formatted print styles for exportable PDF factory blueprints.
* ✅ **Multi-Platform Responsiveness**: Fully tested for mobile phones, tablets, and desktop displays.
* ✅ **Instant Offline Synthesis**: Never crashes if an external API is down or throttled.
