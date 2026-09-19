---
name: Railway browser API access
description: Why the independently deployed API needs both Railway private networking and a restricted public endpoint.
---

Keep the API as its own Railway service. Browser clients use its public domain, while Railway private networking remains available for server-to-server traffic. Restrict browser access to the production frontend origin and require the frontend API URL at build time.

**Why:** A static frontend cannot call a Railway private-network hostname from a user's browser. A public API domain is necessary for browser access; strict CORS prevents other browser origins from using it.

**How to apply:** When adding API-backed frontend features, use the configured client base URL rather than same-origin assumptions. Add trusted frontend domains to the API allowlist deliberately.