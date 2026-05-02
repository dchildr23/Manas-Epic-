# Manas: Voice of the Steppe

> *"A warrior does not rush into battle without knowing his ground."*

An interactive web application for exploring the Epic of Manas — one of the longest oral epics in human history and a cornerstone of Kyrgyz cultural heritage. Built with React, powered by the Anthropic API.

**Live Demo:** [http://localhost:5173/manas-steppe/](http://localhost:5173/manas-steppe/)

---

## Overview

The Epic of Manas is a Kyrgyz oral tradition spanning over 500,000 lines of verse across three generations of heroes. UNESCO recognized it as Intangible Cultural Heritage in 2013. This application brings that tradition to life through interactive learning modules, an immersive story mode, and an AI-powered guide that speaks in the philosophical voice of the steppe.

---

## Features

### Interactive Learning Modules
- **The Epic Timeline** — Five chapters from the birth of Manas to the legacy of Seitek, with expandable narrative panels
- **Key Characters** — Profiles of Manas, Kanikey, Bakay, Semetei, Seitek, and Almambet with trait tags and cultural context
- **Themes of the Steppe** — Deep dives into unity, oral tradition, homeland (Ata-Zhurt), and leadership through service
- **Cultural Context** — The yurt, the horse, the Manaschi tradition, and the Ala-Too homeland

### Story Mode
Choice-based interactive narrative told in the voice of a Manaschi. Follow branching paths through the epic — from Manas's prophesied birth to the transfer of legacy across generations.

### Manas Guide (AI Agent)
An AI chatbot powered by the Anthropic API that responds in a calm, poetic, philosophically grounded tone inspired by the spirit of the epic. It asks reflective questions, uses metaphors rooted in nature and journey, and draws on the themes of Manas to help users think through questions of purpose, leadership, resilience, and identity.

**Ask like a warrior prompts** — pre-built questions to get started:
- How do I stay disciplined when I feel lost?
- What does it mean to be a good leader?
- How should I handle betrayal by someone I trusted?

### Daily Wisdom
A rotating quote from the spirit of the steppe, drawn from the themes of the epic — refreshed each day.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 |
| Styling | Inline CSS with CSS custom properties |
| Fonts | Cinzel (display), Crimson Pro (body) via Google Fonts |
| AI | Anthropic Claude API (`claude-3-5-sonnet-20241022`) |
| Build | Vite |
| Deploy | GitHub Pages via `gh-pages` |

---

## Getting Started

### Prerequisites
- Node.js 18+
- An Anthropic API key ([get one here](https://console.anthropic.com))

### Installation

```bash
# Clone the repo
git clone https://github.com/dchildr23/manas-steppe.git
cd manas-steppe

# Install dependencies
npm install

# Add your API key
cp .env.example .env
# Edit .env and add: VITE_ANTHROPIC_KEY=your_key_here

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

> **Note:** The current implementation calls the Anthropic API directly from the browser. This is suitable for local development and demos. For a fully public deployment, proxy the API call through a backend service (Express, FastAPI, etc.) to keep your API key server-side.

---

## Project Structure

```
manas-steppe/
├── src/
│   ├── App.jsx              # Main app with all components
│   ├── main.jsx             # React entry point
│   └── index.css            # Base reset styles
├── public/
│   └── favicon.ico
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

For a scaled version, the recommended component breakdown is:

```
src/
├── pages/
│   ├── HomePage.jsx
│   ├── StoryTimeline.jsx
│   ├── CharactersPage.jsx
│   ├── ThemesPage.jsx
│   ├── StoryModePage.jsx
│   └── GuideChat.jsx
├── components/
│   ├── NavBar.jsx
│   ├── CharacterCard.jsx
│   └── MessageBubble.jsx
├── hooks/
│   └── useChat.js
├── data/
│   ├── characters.js
│   ├── themes.js
│   ├── timeline.js
│   └── storyNodes.js
└── constants/
    ├── systemPrompt.js
    └── dailyWisdom.js
```

---

## Design

The visual language is **dark steppe minimalism**:

- **Color palette** — burnt gold (`#C17F3A`) on near-black (`#0A0805`), inspired by the open steppe at dusk
- **Typography** — Cinzel for headings (architectural, carved-stone quality), Crimson Pro for body text (warm, literary)
- **Texture** — subtle diagonal grid overlay suggesting traditional Kyrgyz textile pattern without being decorative noise
- **Motion** — fade-enter transitions between sections, smooth hover states throughout

---

## The Manas Guide — System Design

The AI guide is shaped by a detailed system prompt that defines:

- **Tone:** Calm, poetic, philosophically grounded — never commanding or absolute
- **Voice:** Metaphors of nature, battle, journey, and the steppe; draws on epic characters when relevant
- **Behavior:** Asks reflective questions rather than issuing directives; encourages responsibility and resilience
- **Guardrails:** Will not give medical, legal, or financial advice; does not claim divine or prophetic authority; frames itself clearly as inspired by the spirit of the epic

Example exchange:

> **User:** How do I stay motivated when everything feels stuck?
>
> **Guide:** The river in winter does not stop moving — it moves beneath the ice, unseen, patient. What you mistake for stillness may be the season before your next current finds its course...

---

## Cultural Integrity

This application is built with deep respect for Kyrgyz culture and the living oral tradition of the Epic of Manas. It aims to educate and inspire — not to claim authority over a tradition that belongs to the Kyrgyz people.

- References are drawn from documented scholarship on the epic
- The Manas Guide is clearly framed as AI-generated content inspired by the epic's themes
- The app avoids stereotyping and oversimplification of nomadic culture

---

## Acknowledgments

- The Kyrgyz people and the Manaschi tradition, without whom this epic would not exist
- [UNESCO — Intangible Cultural Heritage: Epic of Manas](https://ich.unesco.org/en/RL/epic-of-manas-00209)
- Anthropic Claude API for the Manas Guide intelligence layer

---

## License

---

*Built by [Daniel Childers](https://github.com/dchildr23)*
