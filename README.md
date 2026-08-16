# NewsBot

NewsBot is a **demo AI news assistant** built with Node.js, Express, vanilla JavaScript, and Google's Gemini SDK. It provides a styled news-oriented interface, a server-side chat endpoint, local browser interactions, and several showcase pages.

> **Status:** This repository is a demonstrator, not a production news service. The main news feed, trending stories, live-stream cards, and search experience currently use mock data or local demo behavior. They are not connected to a live news provider in the current codebase.

## What is implemented

The repository currently contains the following verified capabilities:

- A Node.js/Express server serving the static application and several page routes.
- A `/chat` endpoint that sends validated text prompts to the Gemini model configured in `server.js`.
- A browser-based chat interface that posts messages to `/chat`.
- Static pages for the landing view, application, status, about, contact, privacy, terms, help, account, dashboard, and bookmarks views.
- Local browser preferences, profile data, daily demo statistics, and bookmarks implemented with `localStorage`.
- A responsive visual interface with category sections, mock news cards, a mock live-news area, and placeholder-based image fallback behavior.

## Important limitations

The following features are presented as part of the interface but are **not fully backed by live services** in this repository:

- The news feed, trending news, live streams, and search results are driven by hard-coded mock data in `public/script.js`.
- News dates, sources, links, and media shown by the mock feed should not be treated as current or verified reporting.
- Fact-checking, source cross-referencing, historical context, and trend analysis are prompt-level intentions for the chatbot, not independently verified journalistic capabilities.
- The dashboard uses local browser data and simulated statistics; it is not a server-backed account or monitoring system.
- Bookmarks and profile preferences are stored in the current browser only. There is no authentication or shared persistence layer.
- The image `public/assets/placeholder.jpg` is a known placeholder asset. It should be replaced with a properly licensed product asset before presenting the interface as production-ready.

## Requirements

- Node.js 18 or newer.
- npm.
- A Google Gemini API key for live chat requests. Obtain one through [Google AI Studio](https://aistudio.google.com/app/apikey).

## Installation and local run

Clone the repository and install the declared dependencies:

```bash
git clone https://github.com/benoualiabdelkader/NewsBot.git
cd NewsBot
npm install
```

Set the server-side key in the environment that launches Node.js. The application reads `GEMINI_API_KEY`; it does not require a credential to inspect the repository or load the static pages.

```bash
export GEMINI_API_KEY="your_api_key_here"
npm start
```

Open [http://localhost:3000](http://localhost:3000). Without a valid key, the static demo pages can still be inspected, but chat requests will not produce a Gemini response.

Do not commit real API keys. Keep local values outside Git, for example in a shell environment, a deployment secret store, or an untracked `.env` file loaded by your chosen process manager.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Showcase/landing page |
| `/app` | Main application page |
| `/status` | Static status page |
| `/about` | Project information |
| `/contact` | Contact and FAQ content |
| `/privacy` | Privacy information page |
| `/terms` | Terms information page |
| `/help` | Help and FAQ page |
| `/account` | Local profile and preference demo |
| `/dashboard` | Local dashboard demo |
| `/bookmarks` | Local bookmark demo |
| `/chat` | `POST` endpoint for Gemini chat requests |

A chat request has the following shape:

```json
{
  "message": "Summarize the latest developments in artificial intelligence."
}
```

The server rejects missing, empty, or overlong messages. The response is JSON containing a formatted text response when the Gemini request succeeds.

## Project structure

```text
NewsBot/
├── public/                 # Static frontend pages, scripts, styles, and assets
├── server.js               # Express server and /chat endpoint
├── showcase.html           # Landing/showcase page
├── 404.html                # Custom not-found page
├── package.json            # npm metadata and scripts
├── package-lock.json       # Locked dependency tree
├── LICENSE                 # MIT License
└── .gitignore              # Local and generated files excluded from Git
```

The repository intentionally does not track `node_modules/`. Run `npm install` to recreate dependencies locally.

The two historical development captures are retained under `docs/screenshots/` with descriptive names for documentation reference only. They are not loaded by the application. The one-byte file `images/screenshot` was removed because it was not a valid image and had no references.

## API-key design debt

The frontend still contains placeholder constants and commented integration paths for external news, video, search, and Gemini services in `public/script.js`. They are not live credentials, but keeping API-key-shaped configuration in browser code is a design debt: any real key placed there would be exposed to every visitor and could incur unauthorized usage.

This cleanup records the issue without redesigning the frontend integrations. A future production pass should move all privileged API calls to server-side routes, apply provider restrictions and quotas, remove unused client-side key constants, and connect the interface to a verified news source before making real-time or fact-checking claims.

## Development notes

The current `npm test` command is a placeholder and exits with an error because no automated test suite is configured yet. Manual verification should include starting the server, loading the static routes, checking the `/chat` validation responses, and testing the chat path with a valid Gemini key in a controlled environment.

The repository cleanup deliberately does **not** rewrite Git history. Older commits may contain the former placeholder-based key configuration. A historical secret purge or force push is outside this cleanup and requires separate explicit approval.

## Contributing

Create a focused branch, keep changes reviewable, avoid committing secrets or generated dependencies, and open a Pull Request with a clear description of the verification performed.

## License

NewsBot is distributed under the [MIT License](LICENSE). Copyright is attributed to **Benouali Abdelkader**.

## Contact

- GitHub: [@benoualiabdelkader](https://github.com/benoualiabdelkader)
- Repository: [benoualiabdelkader/NewsBot](https://github.com/benoualiabdelkader/NewsBot)
