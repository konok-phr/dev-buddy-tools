
# DevTools Hub — tools.systems.bd

A comprehensive, mobile-responsive developer tools web app with a dark, dev-focused theme (VS Code / GitHub dark mode aesthetic).

## Layout & Navigation
- **Sidebar** on desktop with tool categories and search bar; collapses to a hamburger menu on mobile
- **Home page** with a grid of tool cards showing icon, name, and brief description — searchable and filterable by category
- **Each tool** opens on its own page with a clean, focused interface

## Design
- Dark theme with subtle accent colors (blue/green highlights)
- Monospace fonts for code areas, clean sans-serif for UI
- Responsive: tools stack vertically on mobile with full-width inputs/outputs
- Consistent layout for each tool: input area → action button → output area, with copy-to-clipboard buttons

## Tool Categories & Tools

**Text & Data**
- JSON Formatter & Validator (prettify, minify, validate)
- Base64 Encoder/Decoder
- Markdown Preview (live side-by-side editor)
- Lorem Ipsum Generator
- Log Viewer (paste & highlight/filter log lines)

**Code & Testing**
- Regex Tester (live match highlighting, group extraction)
- API Tester (method, URL, headers, body → response viewer)

**Converters & Generators**
- Timestamp Converter (Unix ↔ human-readable, multiple formats)
- UUID Generator (v4, bulk generate)
- Password Generator (length, character options, strength meter)
- Color Picker (HEX, RGB, HSL with visual picker)

**Security**
- Hash Generator (MD5, SHA-1, SHA-256)

## Key Features
- All tools work client-side (no backend needed), except API Tester which makes requests via a CORS proxy or direct browser fetch
- Copy-to-clipboard on all outputs
- Keyboard shortcuts for common actions
- Tool search on the home page for quick access
