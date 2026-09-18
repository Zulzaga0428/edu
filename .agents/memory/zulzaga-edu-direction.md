---
name: Zulzaga EDU product direction
description: Durable product and platform decisions for the Zulzaga EDU V2 rebuild.
---

Zulzaga EDU V2 should be developed as a mobile-first PWA first. Authentication provider selection and implementation are intentionally deferred until the core product flows are clearer, but the application must preserve an auth/identity boundary from the beginning. Location tracking is outside the current scope. The confirmed opening flow is a clean, static Zulzaga EDU entry followed by a one-role-at-a-time selector; final opening artwork and animation come later.

**Why:** The product is being rebuilt gradually to avoid the old project's architecture debt. A PWA supports the first learning flows without committing early to native-only device capabilities or a specific login provider. The user explicitly confirmed the restrained opening flow because it keeps the early product clear without prematurely designing the final animation.

**How to apply:** Reuse backend contracts, domain logic, validation, and permissions when native clients are considered later. Use mock identities for early UI work, but do not hard-code fake identity assumptions into business logic. Preserve the static tap-to-open entry and single-role selector until the final brand animation is intentionally designed.

Build the student’s core learning and task flow before expanding parent views; parent information should be derived from meaningful student activity rather than invented independently.

**Why:** The user approved this ordering, and it keeps student, parent, and teacher experiences grounded in one coherent source of learning activity.

**How to apply:** Complete one small student journey at a time, then expose the relevant outcomes to parents and teachers.