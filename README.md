# RoboDog — Full-Stack Security Robot Dashboard

RoboDog is a small full-stack app for controlling and monitoring a
"security robot": a Flask + MongoDB backend exposing auth and robot APIs,
paired with a static HTML/CSS/vanilla-JS frontend dashboard.

## Tech Stack

**Backend**
- Flask — web framework
- Flask-CORS — cross-origin request support (frontend runs on a different origin/port)
- PyMongo — MongoDB driver
- Werkzeug — password hashing (`generate_password_hash` / `check_password_hash`)

**Frontend**
- Plain HTML, CSS, and vanilla JavaScript (`fetch` for all API calls, no framework, no build step)
- [Leaflet.js](https://leafletjs.com/) (via CDN) for the patrol map on `patrol.html`

## Project Structure

```
.
├── backend/
│   ├── app.py                # Flask entry point, registers blueprints
│   ├── database.py           # MongoDB connection and collections
│   ├── requirements.txt
│   └── routes/
│       ├── __init__.py
│       ├── auth.py            # /api/auth  — register, login, forgot-password
│       └── robot.py           # /api/robot — movement, patrol, alerts, detection
│
└── frontend/
    ├── style.css               # Shared stylesheet for every page
    ├── index.html              # Register / create account page
    ├── script.js                # Logic for index.html (register form)
    ├── login.html               # Login page
    ├── login.js                  # Logic for login.html
    ├── forgot-password.html     # Forgot-password page
    ├── forgot-password.js        # Logic for forgot-password.html
    ├── dashboard.html            # Main dashboard (overview of everything)
    ├── dashboard.js                # Shared logic: login guard, robot controls,
    │                                # patrol controls, intruder/disaster tests,
    │                                # alerts — included by dashboard/controller/patrol
    ├── controller.html          # Dedicated manual movement controller page
    ├── security.html             # Intruder + disaster detection page (own inline script)
    ├── patrol.html                # Patrol management + Leaflet map page
    └── alerts.html                 # Alert history page (own inline script)
```

> There is also a `main.py` in the backend that sets up a **FastAPI** app and
> imports `routes.auth` as a router. That file is inconsistent with the rest
> of the codebase — `routes/auth.py` is written as a Flask `Blueprint`, not a
> FastAPI `APIRouter` — so `main.py` will not run as-is. Treat `app.py` as
> the real backend entry point.

## Setup

### Backend

1. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate   # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
2. Start MongoDB locally (default expected at `mongodb://localhost:27017`,
   configurable in `database.py`).
3. Run the server:
   ```bash
   python app.py
   ```
   The API is served at `http://127.0.0.1:5000`.

### Frontend

The frontend is fully static — no build step. Serve the `frontend/` folder
with any static file server (e.g. VS Code's Live Server, or `python -m
http.server`) and open `index.html` in the browser. It must be served over
HTTP (not opened as a `file://` path) for `fetch` and Leaflet to behave
correctly.

All pages call the API at the hardcoded base URL `http://127.0.0.1:5000`, so
the Flask backend must be running for any page to function.

## Frontend Pages

| Page                    | Purpose                                                             |
|--------------------------|----------------------------------------------------------------------|
| `index.html`              | Create a new account (`POST /api/auth/register`)                    |
| `login.html`               | Log in (`POST /api/auth/login`); on success, saves the user to `localStorage` and redirects to `dashboard.html` |
| `forgot-password.html`      | Check whether an email is registered (`POST /api/auth/forgot-password`) |
| `dashboard.html`             | One-page overview: user info, robot status/battery, movement controls, intruder/disaster detection, alerts, and patrol summary |
| `controller.html`             | Focused manual movement controller (forward/back/left/right/stop) |
| `security.html`                 | Intruder and disaster detection status, with test/reset buttons |
| `patrol.html`                     | Patrol start/stop/next-stop controls, route/progress display, and a Leaflet map showing the robot's location |
| `alerts.html`                      | Alert totals (by type) and full alert history |

## Known Gaps / Bugs

**Frontend**
- **Broken shared script on `controller.html` and `patrol.html`:** both pages
  include `dashboard.js`, which unconditionally does
  `document.getElementById("welcomeUser").textContent = ...` when a user is
  logged in. Neither page has a `#welcomeUser` element, so this throws and
  **halts the rest of the script** — meaning the movement/patrol buttons
  wired up later in the file may never get their event listeners attached.
  Fix: guard that line with a null check, or split the "welcome user" logic
  into its own function only called from `dashboard.html`.
- **No login guard on `security.html` or `alerts.html`:** unlike
  `dashboard.html`/`controller.html`/`patrol.html`, these two pages don't
  check `localStorage` for a logged-in user, so they're reachable without
  logging in.
- **Duplicate Leaflet `<script>` tag** in `patrol.html` (loaded twice).
- **API base URL is hardcoded** (`http://127.0.0.1:5000`) and duplicated
  across every JS file — would need to be updated in many places for
  staging/production deployment. Consider a single shared `config.js`.
- **No logout logic beyond a link:** the "Logout" nav link just navigates to
  `login.html`; it doesn't clear the saved `user` from `localStorage`, so a
  "logged out" user is still considered logged in by the guard in
  `dashboard.js`.
- **"Forgot password" doesn't reset anything:** it only confirms the email
  exists; there's no follow-up step to actually set a new password.

**Backend** (carried over from the earlier backend review)
- `forgot-password` only checks whether an email exists — no reset token or
  email is sent, and `password_resets_collection` is defined but unused.
- `robot.py`'s `test_intruder`/`test_disaster` routes write to an in-memory
  `alerts` list *and* to MongoDB, so `/alerts` (in-memory) and
  `/alerts/history` (DB) can drift out of sync after a server restart.
- No authentication/session check protects the robot control routes —
  anyone who can reach the API can issue movement commands, regardless of
  whether they're "logged in" on the frontend.
- `MONGO_URL` and other config are hardcoded in `database.py`; consider
  environment variables (e.g. via `python-dotenv`) before deploying.
