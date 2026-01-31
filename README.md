# Startup Benefits Platform

A full-stack **Startup Benefits Platform** for **founders**, **early-stage teams**, and **indie hackers** to access discounted SaaS tools: cloud services, marketing software, analytics tools, and productivity apps. Some deals are **public**; others are **locked** and require user verification. Users can register, browse deals, view details, claim eligible offers, and track claim status in a dashboard.

## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, optional Three.js
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **API:** REST only. JWT authentication (Bearer token in `Authorization` header)

## Repository Structure

```
/backend   → Express REST API (User, Deal, Claim models; JWT auth)
/frontend  → Next.js App Router (landing, deals list, deal details, dashboard)
```

## System Flow (End-to-End)

1. **Landing** – User sees value proposition and animated hero; CTA to explore deals.
2. **Deals listing** – Browse deals; filters (category, locked/unlocked); search; locked deals show “Verification required.”
3. **Deal details** – Full description, partner info, eligibility; claim CTA:
   - Not logged in → prompt login/register (with redirect).
   - Logged in, deal locked, user unverified → “Verification required,” no claim.
   - Logged in and eligible (public deal, or locked + verified user) → claim creates a claim record.
4. **Dashboard** – User profile summary; list of claimed deals with status (pending / approved / rejected).

## Authentication and Authorization Strategy

- **Register:** `POST /api/auth/register` (email, password, name) → user + JWT. Passwords hashed with bcrypt.
- **Login:** `POST /api/auth/login` (email, password) → user + JWT.
- **Current user:** `GET /api/auth/me` (requires `Authorization: Bearer <token>`) → user (id, email, name, isVerified).
- **Protected routes:** Claim deal and “my claims” require valid JWT. Middleware validates token and sets `req.user`.
- **Locked deals:** Only users with `isVerified === true` may claim locked deals. Backend returns `403` with a clear message for unverified users.

## Claim Flow (Internal)

1. Frontend: `POST /api/deals/:dealId/claim` with JWT.
2. Backend: Validate JWT → load deal → if deal locked and user not verified → `403`.
3. If user already claimed (unique userId + dealId) → `409`.
4. Create `Claim` with status `pending` → return `201`.

## Frontend–Backend Interaction

| Page / Action   | API |
|-----------------|-----|
| Landing         | — |
| Deals list      | `GET /api/deals?search=&category=&accessLevel=` |
| Deal detail     | `GET /api/deals/:slugOrId` |
| Claim deal      | `POST /api/deals/:dealId/claim` (auth) |
| Dashboard       | `GET /api/me/claims` (auth) |
| Login / Register | `POST /api/auth/login`, `POST /api/auth/register` |
| Restore session | `GET /api/auth/me` |

## Required Pages (Implemented)

- **Landing** – Premium layout, value proposition, animated hero, “Explore Deals” CTA, section transitions, optional Three.js hero visual.
- **Deals listing** – Grid/list, filters (category, locked/unlocked), search, smooth transitions, locked state (blur, overlay, “Verification required”).
- **Deal details** – Description, partner, eligibility, claim CTA with correct states (login / verification / claim).
- **User dashboard** – Profile summary, claimed deals list, claim status badges (pending / approved), loading skeletons.

## Known Limitations

- **Verification:** `isVerified` is a boolean; no in-app verification flow (e.g. email or admin). Seed can create a verified user for testing.
- **Token storage:** JWT in `localStorage` (XSS risk). Production should use httpOnly cookies or short-lived tokens + refresh.
- **No rate limiting** on auth or claim endpoints.
- **Search:** Regex on title/description (no full-text index).
- **No pagination** on deals or claims lists.

## Future Improvements (Production Readiness)

- Rate limiting on auth and claim endpoints.
- Real verification flow (email or admin) and set `isVerified` accordingly.
- httpOnly cookies or access/refresh tokens and CSRF protection.
- Request validation (e.g. express-validator or Zod).
- Pagination and sorting for deals and claims.
- Environment-based CORS and MongoDB URIs.
- Health check, logging, monitoring.
- Unit and integration tests for auth, deals, and claims.

## UI and Performance

- **Animations:** Framer Motion for page transitions, list/hover feedback, skeleton loaders.
- **Optional Three.js:** Hero section can include a 3D visual (e.g. gradient orb) for a premium feel.
- **Locked deals:** Clear visual distinction and messaging; claim disabled when not eligible.
- **Responsiveness:** Tailwind breakpoints; mobile-friendly layout.

## Running the Project

**Backend**

```bash
cd backend
cp .env.example .env   # set MONGODB_URI and JWT_SECRET
npm install
npm run seed          # optional: seed deals and demo users
npm run dev           # http://localhost:4000
```

**Frontend**

```bash
cd frontend
# optional: .env.local with NEXT_PUBLIC_API_URL=http://localhost:4000/api
npm install
npm run dev           # http://localhost:3000
```

Open `http://localhost:3000`. Use a verified user (e.g. seed: `verified@example.com` / `verified123`) to test claiming locked deals.

---

*All submitted code is original work. No AI-generated or copied project code.*
