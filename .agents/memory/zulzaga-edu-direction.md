---
name: Zulzaga EDU product direction
description: Durable product and platform decisions for the Zulzaga EDU V2 rebuild.
---

Zulzaga EDU V2 should be developed as a mobile-first PWA first. Authentication provider selection and implementation are intentionally deferred until the core product flows are clearer, but the application must preserve an auth/identity boundary from the beginning. Location tracking is outside the current scope.

**Why:** The product is being rebuilt gradually to avoid the old project's architecture debt. A PWA supports the first learning flows without committing early to native-only device capabilities or a specific login provider.

**How to apply:** Reuse backend contracts, domain logic, validation, and permissions when native clients are considered later. Use mock identities for early UI work, but do not hard-code fake identity assumptions into business logic.