# Security Dashboard — Expo / React Native

A dark-mode iOS home security dashboard app with live video streaming and AI motion alerts.

## Features
- 📹 **Live Video Player** — MJPEG/MP4 stream with mute, retry, and live badge
- 🤖 **AI Alert Feed** — Real-time Gemini motion alerts with severity color coding
- ⚙️ **Settings** — Swap local IP ↔ ngrok/Cloudflare URL on the fly
- 🏗️ **GitHub Actions CI/CD** — Builds `.ipa` on cloud Mac automatically

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start Expo dev server
npx expo start

# 3. Scan QR code with Expo Go on your iPhone
```

## Python Bridge

```bash
cd python_bridge
pip install -r requirements.txt

# Standalone test
python alert_server.py

# Or import into your existing Gemini script:
# from alert_server import run_server, add_alert
# run_server()
# add_alert("Person detected", severity="high")
```

## Building the IPA (No Mac Needed)

1. Create an [Expo account](https://expo.dev) and project
2. Get your EAS token: expo.dev → Account → Access Tokens
3. Add `EXPO_TOKEN` as a GitHub repository secret
4. Push to `main` — GitHub Actions builds the `.ipa` automatically
5. Download from: Actions → your run → Artifacts

## Remote Access

Replace local IPs in Settings with a tunnel URL:

```bash
# ngrok
ngrok http 8080        # for video stream
ngrok http 5000        # for alert server

# Cloudflare (free, no account needed for temp tunnels)
cloudflared tunnel --url http://localhost:5000
```

## Project Structure

```
app/
  _layout.tsx          # Root layout + AppProvider
  index.tsx            # Main dashboard (video + alerts)
  settings.tsx         # Settings modal
src/
  context/AppContext.tsx   # Global state
  components/
    VideoPlayer.tsx         # expo-av video component
    AlertFeed.tsx           # FlatList alert cards
  hooks/
    useAlertPoller.ts       # 5s polling hook
  theme.ts                 # Design tokens
python_bridge/
  alert_server.py      # Flask bridge server
.github/workflows/
  ios-build.yml        # GitHub Actions IPA builder
```
