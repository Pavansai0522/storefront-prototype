# Contributing to My-Agency

## Who This Is For

Every developer on this project — frontend, backend, QA.
These are not suggestions. They are standards.

## Getting Started

1. Clone the repo
2. Run `npm install` from root
3. Copy `server/.env.example` to `server/.env`
4. Run `npm run dev:client` / `npm run dev:watches` / `npm run dev:liquor` / `npm run dev:server`

## Branch Strategy

- `main` — production ready, protected
- `develop` — integration branch
- `feature/*` — new features
- `fix/*` — bug fixes
- `hotfix/*` — urgent production fixes

Never push directly to main.

## Commit Messages

Follow Conventional Commits strictly:

- feat: new feature
- fix: bug fix
- chore: tooling, dependencies
- refactor: code improvement, no behavior change
- docs: documentation only
- style: formatting, spacing, no logic change
- perf: performance improvement

## Pull Request Checklist

Before opening a PR, verify:

- [ ] `npm run build` passes in all workspaces
- [ ] No console.log in src/
- [ ] No TypeScript errors (strict mode)
- [ ] No unused imports
- [ ] Mobile responsive (test at 375px)
- [ ] All interactive elements have 44px tap targets
- [ ] New components follow naming conventions
- [ ] New pages added to README

## Code Review Standards

- Reviewer must check: types, naming, mobile, performance
- No PR merged without at least 1 approval
- CI must be green before merge

## QA Process (Chinni Dasari)

- Smoke test: login, products CRUD, store info save
- Regression test: all pages on mobile + desktop
- Test both roles: superadmin and admin
- Report bugs with: screenshot + steps to reproduce

## Design Tokens (Never hardcode these)

| Token | Value | Usage |
| --- | --- | --- |
| brand-bg | #0A0A0A | Page background |
| brand-card | #1A1A2E | Card background |
| brand-saffron | #FF6B00 | Primary accent |
| saffronHover | #ff8533 | Hover state |
| surface-sidebar | #111111 | Sidebar bg |
| surface-rowAlt | #1A1A1A | Table rows |
| font-display | Bebas Neue | Headings |
| font-sans | Inter | Body text |

## Questions?

Ask before you build. Wrong direction = wasted time.
