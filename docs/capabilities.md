# Capability configuration
- Web search: opt in with AI_WEB_SEARCH=true and BRAVE_SEARCH_API_KEY. Search sends the current short query to Brave and snippets to the AI provider. Search pricing and limits must be verified before enabling. Search snippets are untrusted; model citations are not independently verified.
- Vision: configure an exact supported model via the corresponding VISION_MODEL environment variable. Only one image up to 1 MiB on the latest user turn.
- Text attachments: TXT, Markdown, CSV, JSON. Current prompt limit 12,000 characters. PDF, DOCX and XLSX parsing is not implemented.
- Voice: browser dictation and speech synthesis, not a real-time audio model.
- Public guest access remains disabled pending persistent quotas and abuse controls.
- All features require build and live integration verification before production deployment.
