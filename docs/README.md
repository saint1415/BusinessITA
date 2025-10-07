# Business ITA - Local

HTML/JS-only incident template assistant. Open index.html in a modern browser. No backend required.

- Generate incident IDs (YYYYMM_NN), revisions (.RR starting at 00)
- Mandatory embedded metadata in rendered outputs for reliable round-trip parsing
- Templates for common audiences; add your own via upload during a session
- Copy-to-clipboard or Print to PDF for distribution

## Getting Started
1. Open `index.html` (double-click). If your browser blocks local file access for some features, use a simple static server (optional).
2. Click Generate ID, fill Incident details.
3. Choose audience and Generate Communications, edit tokens, then view Rendered/Preview.
4. Download rendered.txt and incident.json. Zip them with 7-Zip or Windows 11.

## Notes
- This app does not write to disk automatically; downloads are user-initiated.
- Embedded metadata is required and included automatically in all rendered outputs.
