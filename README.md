# 🛡️ PhishLens AI — Real-Time Privacy-Preserving Anti-Phishing & Visual Spoofing Platform
### Manifest V3 Chromium Extension with Embedded Conversational AI Security Assistant ("PhishLens Sentinel") & Cloud Intelligence Center

---

## 🚀 Overview

**PhishLens AI** is an enterprise-grade cybersecurity system designed to protect non-technical everyday web users, high-value corporate accounts, and enterprise employees from visual brand impersonation, zero-hour homoglyphs, credential harvesting, delayed DOM rendering evasions, and clone phishing attacks.

It combines:
1. **Client-Side Manifest V3 Chromium Extension:** Ultra-fast (<250ms) on-device DOM inspection, HTML5 Canvas 2D Discrete Cosine Transform (DCT) Perceptual Hashing (pHash), continuous MutationObserver tracking delayed evasions (1.5s–5s post-load), and an isolated Shadow-DOM warning shield with an embedded conversational assistant.
2. **"PhishLens Sentinel" Embedded Conversational AI Assistant:** Real-time Server-Sent Events (SSE) streaming assistant embedded directly in an isolated Shadow-DOM drawer, grounded in active tab telemetry and powered by `gemini-2.5-flash` via the official `@google/genai` SDK.
3. **Cloud Intelligence Server & Central Enterprise Dashboard:** Express.js REST API with rate-limiting, strict Zod contract validation, PostgreSQL 16+ pool with resilient fallback, threat feed audit table, visual forensic inspection view, user false-positive dispute desk, and brand anchor dictionary manager.

---

## 📐 Mathematical Heuristic Scoring Engine

The on-device triage engine computes a composite risk score $Score \in [0, 100]$:

$$Score = \min\left(100, \sum w_i \cdot c_i\right)$$

| Signal Identifier | Heuristic Name | Condition Description | Weight ($w_i$) |
| :--- | :--- | :--- | :---: |
| `URL_PUNYCODE_HOMOGLYPH` | Homoglyph/Punycode | Hostname contains non-ASCII or Levenshtein distance 1 to targeted brand | 30 |
| `URL_SUSPICIOUS_TLD` | Suspicious TLD | TLD in known high-abuse list (`.xyz`, `.top`, `.tk`, `.work`, `.click`) | 15 |
| `DOM_EXTERNAL_FORM_ACTION` | External Form Target | `<form action>` target domain doesn't match window host domain | 35 |
| `DOM_CREDENTIAL_IN_UNTRUSTED` | Insecure Credential Field | Input `type="password"` present on non-verified high-risk layout | 25 |
| `VISUAL_PHASH_MATCH_UNTRUSTED`| Visual Brand Impersonation | Local pHash matches known brand logo with Hamming distance $\le 10$, but host mismatch | 40 |
| `ANTI_EVASION_DELAYED_RENDER` | Delayed Render Injection | Password/logo node attached via script $>1000\text{ms}$ post-load | 20 |
| `IFRAME_FULLSCREEN_OVERLAY` | Phishing Overlay Iframe | Iframe covering $>80\%$ of viewport with external origin | 25 |

### Risk Classification:
* **Safe (0–34):** Toolbar badge green. Passive Sentinel pill available in bottom-right corner.
* **Suspicious (35–69):** Toolbar badge amber. Warning notification with instant option to consult Sentinel.
* **High Risk (70–100):** Toolbar badge red. Immediate full-page interaction freeze, form inputs disabled, Shadow-DOM modal shield injected, direct escalation to Sentinel AI emergency protocol.

---

## 📁 Repository Structure

```
idea/
├── shared/
│   └── validators.ts                # Zod v3 schemas (Telemetry, Assistant, Threat responses)
├── server/
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── index.ts                 # Express entrypoint, Helmet, CORS, Rate Limiters
│   │   ├── config/env.ts            # Environment variables loader
│   │   ├── db/
│   │   │   ├── client.ts            # PostgreSQL pool with resilient fallback store
│   │   │   └── schema.sql           # Strict PostgreSQL 16+ DDL with RLS & indexes
│   │   ├── lib/gemini.ts            # Official @google/genai SDK setup (gemini-2.5-flash)
│   │   ├── middleware/              # Auth, error handling, rate limiting
│   │   ├── routes/
│   │   │   ├── telemetry.ts         # Ingestion & evaluation (/api/v1/telemetry/*)
│   │   │   ├── assistant.ts         # SSE streaming dialogue (/api/v1/assistant/*)
│   │   │   ├── brandAnchors.ts      # Brand signatures sync (/api/v1/signatures/*)
│   │   │   └── admin.ts             # Threat audit, stats, whitelist (/api/v1/admin/*)
│   │   └── services/
│   │       ├── forensicEngine.ts    # Neural triage validator
│   │       └── heuristicScorer.ts   # Mathematical scoring matrix
├── extension/
│   ├── manifest.json                # Manifest V3 specification
│   ├── vite.config.ts
│   ├── popup.html                   # Extension toolbar popup
│   ├── public/icons/                # Extension icons (16, 48, 128 px)
│   └── src/
│       ├── background/serviceWorker.ts # Tab lifecycle, offscreen canvas manager, badge updater
│       ├── content/
│       │   ├── contentScript.ts     # In-page orchestration & form freezing
│       │   ├── domInspector.ts      # Password, form, and candidate logo harvesting (zero PII)
│       │   ├── mutationMonitor.ts   # MutationObserver watching delayed render evasions
│       │   ├── modalInjector.tsx    # Mounts closed ShadowRoot <phishlens-modal-root>
│       │   └── assistantInjector.tsx # Mounts closed ShadowRoot <phishlens-assistant-root>
│       ├── offscreen/               # HTML5 Canvas 32x32 DCT Perceptual Hashing
│       ├── popup/Popup.tsx          # Real-time tab status and Sentinel launch card
│       └── ui/                      # Isolated React components (ModalShield, AssistantDrawer)
├── dashboard/
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── App.tsx                  # Tab navigation & threat management center
│       ├── components/
│       │   ├── StatSummaryWidget.tsx # Operational metrics & telemetry stats
│       │   ├── ThreatFeedTable.tsx   # Intercepted attacks audit feed
│       │   ├── ForensicModal.tsx     # Deep forensic visual & DOM inspector
│       │   ├── ConversationViewer.tsx# User interaction transcripts
│       │   ├── BrandManager.tsx      # Enterprise brand anchor manager
│       │   ├── WhitelistTable.tsx    # Global whitelist domain manager
│       │   ├── ReportsDesk.tsx       # False positive triage queue
│       │   └── PublicLookup.tsx      # Public URL scanner
│       └── lib/api.ts               # Typed backend API client
└── test/
    └── suite.js                     # 14-point automated end-to-end verification suite
```

---

## ⚡ Quick Start & Verification

### 1. Run Verification Test Suite
```bash
node test/suite.js
```
*Executes all 14 end-to-end tests covering mathematical heuristics, string distance, schema validation, server endpoints, streaming SSE assistant responses, and credential emergency triage.*

### 2. Start Cloud Intelligence Server
```bash
cd server
npm run dev
```
*Server starts on `http://localhost:5000`.*

### 3. Start Enterprise Threat Dashboard
```bash
cd dashboard
npm run dev
```
*Dashboard opens on `http://localhost:3000`.*

### 4. Build and Load Chrome Extension
```bash
cd extension
npm run build
```
1. Open Google Chrome or Chromium browser.
2. Navigate to `chrome://extensions/`.
3. Enable **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select the `idea/extension/dist` folder.
5. The PhishLens AI shield icon will appear in your toolbar!

---

## 🔒 Security & Privacy Guarantees

* **Zero-PII Transmission:** Content scripts NEVER transmit raw passwords, cleartext form values, user keystrokes, or full screenshots. Only structural metadata (domain name, relative action target, input field names, and perceptual hash digests) are evaluated.
* **Isolated Shadow DOM (`mode: 'closed'`):** All injected warning modals and Sentinel AI chat drawers are mounted inside isolated shadow roots with `z-index: 2147483647` and CSS resetting (`all: initial`) to prevent malicious host script or style hijacking.
* **Anti-Prompt-Injection Boundary:** System prompts are strictly separated from DOM attributes and telemetry data is treated as untrusted observational parameters.

