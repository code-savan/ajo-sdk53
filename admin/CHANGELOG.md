# AJO Admin – Changelog

All notable changes to the AJO Admin (Next.js) project will be documented in this file.

## [0.0.2] - 2025-08-11
### Changed
- Sidebar built to match screenshot and design tokens:
  - Link text 16px regular, color #1E1E1E
  - Section titles 14px regular, color #7E7E7E
  - Active item background #DDE8FF
  - Borders use #D9D9D9
  - Fixed left sidebar with bottom user section and top brand row
- Header updated to show page title (20px, black, medium) and actions area.

### Added
- Design tokens wired in CSS for content bg (#F8F8F8), text, borders, active state.

## [0.0.1] - 2025-08-11
### Added
- Project initialized and admin UI scaffolded.
- Pre-dev design notes captured based on provided screenshot.

### Pre-Dev Notes (Source of truth for UI cloning)
- General
  - Always work with the screenshot attached. The result should be a visual clone of the screenshot.
  - Heading texts: 20px, black, medium (500-600 weight depending on font).
  - Borders: #D9D9D9
  - Admin body content area background: #F8F8F8

- Sidebar
  - Active link background: #DDE8FF
  - Link text and icon color: #1E1E1E
  - Link text typography: 16px, regular (400)
  - Section titles (e.g., "Main menu", "Support"): color #7E7E7E, 14px, regular (400)

- Layout
  - Left sidebar fixed, content area scrolls independently.
  - Top app bar shows page title on the left and profile/notification area on the right.

### Acceptance Criteria for UI parity
- Sidebar active item uses background #DDE8FF and non-active items remain on a white background with #1E1E1E text/icons.
- Section dividers and any visible borders use #D9D9D9.
- Content area background is #F8F8F8 across the full canvas behind cards/sections.
- Typography matches sizes and weights listed above.

### Next Steps
- Wire Tailwind theme tokens to match these colors/typography for consistency (e.g., --sidebar-active, --text-primary, --border-base, --bg-content).
- Build out pages for: Overview, User Management, Group Management, Financial Management, Analytics, Notifications, Settings, Help & Support.
- Implement active state styling in the Sidebar using exact values above.

---

Keep this file updated with each change. Start the next entry at [0.0.2] when new work begins.

