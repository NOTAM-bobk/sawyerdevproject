# Sawyer Schulz — personal site

A Vercel-styled personal site with hand-drawn accents, plus the backend behind it:
the enquiry form, a password-protected admin panel, and a private dashboard for each client.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4 and MongoDB.

---

## How it fits together

Front end and back end live in **one project on one domain**. The pages are React;
everything under `app/api/` is a Vercel Function, served from the same origin as the
pages. The browser only ever calls relative paths (`/api/start`, `/api/admin/login`,
…), so there is no API URL to configure, no CORS, and no second service to deploy.
Point your domain at the Vercel project and the backend moves with it.

| Piece | Route | Who gets in |
|---|---|---|
| Site | `/`, `/about`, `/projects`, `/pricing`, `/start` … | everyone |
| Enquiry form | posts to `/api/start` | everyone |
| Admin panel | `/admin` | `ADMIN_PASSWORD` |
| Client dashboard | `/dashboard` | the client's own access code, or `ADMIN_PASSWORD` |

What happens when someone sends an enquiry:

1. The answers are **stored in MongoDB** (first, always).
2. A **client dashboard** is created for them, with a random access code like `JZKH-5RFH-9PZ6`.
3. They are **signed straight into it** and shown the code.
4. If email is configured, you also get the enquiry by email — with the code in it.

Step 1 never depends on step 4. If your mail provider is down or unset, nothing is lost.

---

## Requirements

- Node.js 20 or newer (built and tested on Node 24)
- A MongoDB database — the free MongoDB Atlas tier is plenty (see below)
- Optionally, a [Plunk](https://useplunk.com) account for the enquiry emails

## Local development

```bash
npm install
cp .env.example .env.local     # then fill in the values below
npm run dev
```

Open http://localhost:3000. Without any env vars the site still runs — the form just
falls back to a pre-filled email and the admin panel tells you it is not configured.

To run the backend locally, point `MONGODB_URI` at a local database:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/sawyer
```

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |

---

## Environment variables

Set these in **Vercel → your project → Settings → Environment Variables** (Production
and Preview), and in `.env.local` for local work. `.env*` files are gitignored.

| Name | Required | What it is |
|---|---|---|
| `ADMIN_PASSWORD` | **yes** | The password for `/admin` and for your own view of `/dashboard`. It also signs the session cookies, so changing it signs out every device. |
| `MONGODB_URI` | **yes** | Where enquiries and client dashboards are stored. |
| `NEXT_PUBLIC_SITE_URL` | no | Your canonical domain, e.g. `https://yourdomain.com`. Used for canonical URLs, Open Graph tags, the sitemap and the JSON-LD. On Vercel this is worked out for you from the project's production domain, so you only need it if you want to force a particular one. |
| `PLUNK_SECRET_KEY` | no | `sk_...` from Plunk. Without it, enquiries are stored but no email is sent. |
| `CONTACT_TO_EMAIL` | no | Where enquiry emails go. Defaults to the site email in `content/site.ts`. |
| `CONTACT_FROM_EMAIL` | no | The `from` address. Its domain must be verified in Plunk. |

After changing an env var on Vercel, **redeploy** — variables are read at build/run time.

---

## 1. Storage — MongoDB Atlas

Free, no schema and no migrations: a record is appended, listed and deleted.

1. Create a free **M0** cluster at <https://www.mongodb.com/atlas>.
2. **Database Access** → add a database user with a password.
3. **Network Access** → allow `0.0.0.0/0`. Vercel Functions have no fixed IP address,
   so this is how they reach Atlas.
4. **Connect → Drivers** → copy the connection string and put your database name on the
   end, e.g. `mongodb+srv://user:pass@cluster0.abcd.mongodb.net/sawyer`.
5. Set it as `MONGODB_URI`.

If `MONGODB_URI` is missing or unreachable, nothing crashes: `/admin` says storage could
not be reached instead of throwing, and the form falls back to email.

## 2. Email — Plunk (optional)

1. Create a project at <https://useplunk.com> and verify a sending domain.
2. **Settings → API Keys** → copy the secret key into `PLUNK_SECRET_KEY`.
3. Set `CONTACT_TO_EMAIL` (where you receive enquiries) and `CONTACT_FROM_EMAIL` (must
   be on the verified domain).

---

## 3. Deploy to Vercel

1. Push this repository to GitHub.
2. <https://vercel.com/new> → import the repo. Next.js is detected automatically; leave
   the build settings alone.
3. Add the environment variables above, then **Deploy**.
4. Check the deployment: open `/`, send a test enquiry, then open `/admin` and sign in.

The API routes are deployed as Vercel Functions in the same project, so they are live on
the same URL as the site — no extra hosting, no separate backend.

## 4. Put it on your domain

1. **Vercel → project → Settings → Domains → Add Domain**, and enter your domain.
2. Vercel shows the exact DNS records to create at your registrar:
   - **apex** (`yourdomain.com`) → an **A** record
   - **subdomain** (`www.yourdomain.com`) → a **CNAME** record
   - or switch the domain's **nameservers** to Vercel and let it manage DNS
3. Add both the apex and `www`, and let Vercel redirect one to the other.
4. Wait for the certificate to show as issued; HTTPS is automatic.

Nothing in the code needs to change. The backend is on the same origin, canonical URLs
follow the production domain that Vercel reports, and the session cookies are marked
`Secure` in production, so sign-in requires HTTPS — which the custom domain gives you.

### Worth knowing about the domain switch

- **Use `https://`** for `/admin` and `/dashboard`. The cookies are `Secure`, so a plain
  `http://` visit will not be able to sign in.
- If the form or the panel behaves oddly right after adding the domain, it is almost
  always the old **`NEXT_PUBLIC_SITE_URL`/build** or DNS still propagating. Redeploy once
  the domain shows as valid.
- To force a specific canonical domain, set `NEXT_PUBLIC_SITE_URL=https://yourdomain.com`
  and redeploy (it is baked in at build time).

---

## 5. Using it

### The enquiry form — `/start`
A visitor fills it in, and on submit:

- the enquiry is stored, and a client dashboard is created for them;
- they are signed in and shown their **access code** with a copy button and a link in;
- you get an email (if Plunk is set) with every answer and the code.

A hidden honeypot field catches bots: if it is filled, the request is silently dropped.

### Your admin panel — `/admin`
Linked from the footer. Sign in with `ADMIN_PASSWORD`.

- **Enquiries** — newest first, each expandable to every answer, with **Reply** (a
  pre-filled email), **Delete**, a search box, and **Export CSV**.
- **Client dashboards** — one per enquiry. Open one and you can edit the status
  (Under review / Accepted / Not taken on / Delivered) and the note underneath, what you
  are working on, the stats, the checklist, the updates, the links, the target date, and
  the live chat. There is a **Preview** link to see exactly what the client sees, an
  **Issue a new code** button, and **Delete**, which removes the dashboard and the
  original enquiry together — they are the same record.

### The client dashboard — `/dashboard`
One sign-in for two kinds of visitor:

- **You** type `ADMIN_PASSWORD` and get the list of every client dashboard.
- **A client** types their code and sees only their own page: whether you took the job,
  your note, current stats, what you are working on with a progress bar, dated updates,
  the checklist, project links, a live deadline countdown, and a chat thread with you.

Access codes are the shape `XXXX-XXXX-XXXX` (case and dashes are forgiving) and are
stored **hashed**, so they cannot be read back out — issue a new one if a client loses
theirs. Client sessions last 30 days; your admin session lasts 8 hours.

---

## Editing the content

All copy — bio, projects, pricing, FAQ, skills, contact details — lives in one file:
[`content/site.ts`](./content/site.ts). Form questions live in `content/form.ts`, and
legal pages in `content/legal.ts`.

## Security notes

- **`ADMIN_PASSWORD` is the whole lock.** There is one user and no accounts to manage.
  Use something long and unique; it can also open any client's dashboard, so treat it as
  the master key.
- The admin panel is `noindex`, disallowed in `robots.txt`, kept out of the sitemap, and
  every response is `no-store`.
- Every state-changing API checks the session cookie, that the request came from your own
  origin, and (for admin actions) that you are signed in.
- Wrong passwords are throttled per IP, but each serverless instance keeps its own counter,
  so treat that as a speed bump, not a wall. The password is the real control.
- Signing out clears the cookie. The session token itself stays valid until it expires
  (8 hours for admin, 30 days for clients); changing `ADMIN_PASSWORD` invalidates every
  existing session immediately.
- Client cookies are signed independently of the access code, so rotating a code never
  hands a session to whoever still has the old one.

## Troubleshooting

| Symptom | Cause |
|---|---|
| `/admin` says storage could not be reached | `MONGODB_URI` is missing or wrong, or Atlas network access blocks the connection |
| The form says your enquiry was saved but no email arrived | `PLUNK_SECRET_KEY` is unset, or the sending domain is not verified in Plunk |
| The form offers a pre-filled email instead of confirming | Neither storage nor email is configured — set at least one |
| Cannot sign in on the live domain | You are on `http://`; the cookies are `Secure`, so use `https://` |
| A client cannot get in | Their code was rotated, or they are using the old code. Open their dashboard in the admin panel and issue a new one |
