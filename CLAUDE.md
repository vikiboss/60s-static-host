# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an automated news aggregation service that fetches daily Chinese news from WeChat public accounts, parses them using LLM, and generates static JSON data and PNG images for hosting. The project runs on GitHub Actions scheduled tasks and uses Bun as the runtime.

## Core Architecture

### Main Update Flow (src/update-60s.tsx)

The entry point orchestrates the entire update process:

1. **Date Handling**: Accepts optional `--date=YYYY-MM-DD` argument, defaults to current date
2. **Data Check**: Skips if both JSON and PNG already exist for the date
3. **WeChat Fetch**: Queries multiple WeChat accounts sequentially until finding target article
4. **Article Parsing**: Uses LLM (Gemini) as primary parser with fallback to standard parser
5. **Data Storage**: Saves JSON to `static/60s/` and PNG to `static/images/`

### Service Modules

- **wechat.ts**: WeChat MP API client that requires authentication (token/cookie in env vars)
  - Searches articles by date query (e.g., "10月8日 读懂世界")
  - Returns posts with metadata (title, cover, timestamps, link)

- **parser.ts**: HTML content parser using Gemini LLM
  - Extracts: news array (15 items), cover image, daily tip
  - Uses structured JSON schema for reliable output
  - Falls back to official API if third-party proxy fails

- **renderer.tsx**: Puppeteer-based image generator
  - Renders React components to HTML using server-side streaming
  - Uses UnoCSS runtime for styling
  - Configured for CJK fonts (Noto Sans CJK SC priority)
  - Takes screenshots at 1.6x device scale factor

- **storage.ts**: File system abstraction for JSON and PNG files
  - Optimizes PNG with Sharp (compression level 9, palette mode)
  - Follows `YYYY-MM-DD` filename convention

### Component Structure

- **components/news.tsx**: React component for news card rendering (used by renderer service)

## Development Commands

```bash
# Run daily update (uses current date)
bun run update

# Run update for specific date
bun run update --date=2025-10-08

# Debug/development script
bun run debug
```

## Environment Variables

Required for production:
- `WECHAT_TOKEN`: WeChat MP platform token
- `WECHAT_COOKIE`: WeChat MP authentication cookie
- `GEMINI_API_KEY`: Google Gemini API key for LLM parsing

## CI/CD (GitHub Actions)

The `.github/workflows/schedule.yaml` workflow:
- Runs every 10 minutes during 00:00-10:00 Beijing time (16:00-02:00 UTC)
- Caches Chromium binary and Noto CJK fonts for faster builds
- Configures fontconfig to prioritize Simplified Chinese glyphs
- Commits and pushes data automatically if changes detected

## Data Format

All data follows this structure (see README.md for full example):
- `date`: YYYY-MM-DD string
- `news`: Array of 15 news items (cleaned, no prefixes/suffixes)
- `cover`: WeChat article cover image URL
- `image`: CDN URL pointing to generated PNG in this repo
- `tip`: Daily inspirational quote
- `link`: WeChat article URL (cleaned)
- `created`/`updated`: Human-readable timestamps
- `created_at`/`updated_at`: Unix milliseconds

## Key Constants (src/constants.ts)

- Three WeChat accounts configured as fallbacks
- Static paths: `static/60s` for JSON, `static/images` for PNG
- User agent string for WeChat requests

## API Endpoints & CDN Distribution

The service provides multi-CDN access for both JSON and PNG files:

**JSON Data:**
- Primary: `https://60s-static.viki.moe/60s/[date].json`
- jsDelivr: `https://cdn.jsdelivr.net/gh/vikiboss/60s-static-host@main/static/60s/[date].json`
- jsDelivr Mirror: `https://cdn.jsdmirror.com/gh/vikiboss/60s-static-host@main/static/60s/[date].json`

**PNG Images:**
- jsDelivr Mirror: `https://cdn.jsdmirror.com/gh/vikiboss/60s-static-host@main/static/images/[date].png`

Replace `[date]` with `YYYY-MM-DD` format (e.g., `2025-01-15`)

## Static Homepage (static/index.html)

The project homepage features:
- Modern dark theme with gradient backgrounds and hover effects
- Real-time data preview with date selector
- Interactive JSON and image viewer
- One-click copy buttons for API endpoints
- Responsive design with mobile support
- Auto-loads today's data on page load

**Key Features:**
- Dark theme with blue/purple gradient accents
- Live preview of JSON data and generated PNG images
- Date picker for exploring historical data
- Copy-to-clipboard functionality for API endpoints
- Error handling for missing dates

## Troubleshooting

- If update fails, check WeChat credentials (token/cookie may expire)
- LLM parsing requires Gemini API key; fallback parser is less reliable
- Chromium executable path differs between CI (`.chromium/chrome-linux/chrome`) and local (`/Applications/Google Chrome.app`)
- Font rendering issues in CI are addressed by explicit Noto CJK SC configuration
- The homepage loads data from jsDelivr CDN for better performance and caching
