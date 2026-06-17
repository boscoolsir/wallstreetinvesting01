# 华尔街投资体验 — Cool Sir Edulife Academy
### Seminar Registration Landing Page

A premium, fully responsive seminar registration landing page with Google Sheets backend integration and automatic confirmation emails. Built with pure HTML/CSS/JS — no frameworks, no build step, no dependencies.

---

## 📁 What's in this package

| File | Purpose |
|---|---|
| `index.html` | The landing page structure (hero, about, experience, registration form, success modal, footer) |
| `style.css` | All styling — navy/gold/white premium theme, animations, full responsive layout |
| `script.js` | Form validation, scroll animations, submission logic, success modal handling |
| `Code.gs` | Google Apps Script backend — receives form data, writes to Google Sheets, sends confirmation email |
| `assets/logo.png` | Your Cool Sir Edulife Academy logo, used in the navbar, footer, and favicon |
| `README.md` | This file |

---

## ✅ Step 0 — Logo

Your real logo (`assets/logo.png`) is already wired into the site — navbar, footer, and browser favicon. Since the original file had a lot of empty white space around the wordmark, it's been cropped to just the "Cool Sir / EDULIFE ACADEMY" text and displayed inside a white rounded rectangular badge (wider than tall, matching the logo's natural proportions) in the navy navbar and footer, so the black wordmark stays crisp and legible against the dark background.

If you ever want to swap in a different version of the logo later (e.g. a transparent PNG, or an updated design):

1. Replace `assets/logo.png` with your new file (keep the same filename, or update the three references below if the filename changes).
2. The three places referencing it in `index.html` are: the favicon `<link>` tag in `<head>`, the navbar `<img id="brandLogo">`, and the footer `<img class="footer__logo">`.
3. If your new logo has very different proportions (e.g. a square icon instead of a wide wordmark), you may want to adjust the badge dimensions in `style.css` under `.navbar__logo` and `.footer__logo` so it doesn't look squeezed or have excess empty space.

---

## 🗂 Step 1 — Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a **new blank spreadsheet**.
2. Name it something like `Cool Sir Edulife — 华尔街投资体验 Registrations`.
3. You don't need to create any tabs or headers manually — the backend script will automatically create a sheet tab named **"Registrations"** with the correct headers (`Timestamp, Name, Whatsapp, Email, Experience, Learning Goal`) the first time someone registers.
4. Keep this spreadsheet open — you'll attach the script to it in the next step.

---

## ⚙️ Step 2 — Deploy the Google Apps Script backend

1. In your Google Sheet, click **Extensions → Apps Script**.
2. Delete any placeholder code in the editor (the default `function myFunction() {}`).
3. Open the `Code.gs` file from this package, copy **all of its contents**, and paste it into the Apps Script editor.
4. Click the **💾 Save** icon (or `Ctrl/Cmd + S`).
5. Rename the Apps Script project if you like (top-left, click "Untitled project") — e.g. `U88 Seminar Backend`.

### Deploy as a Web App

1. Click **Deploy → New deployment**.
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**.
3. Fill in:
   - **Description:** `Seminar registration endpoint` (or anything you like)
   - **Execute as:** `Me (your-email@gmail.com)`
   - **Who has access:** `Anyone`

   > ⚠️ "Anyone" is required so the public landing page can submit data without requiring visitors to log into Google. Your script still only writes to *your* Sheet and sends from *your* Gmail — "Anyone" just means anyone can *call* the endpoint, not access your data directly.

4. Click **Deploy**.
5. The first time you deploy, Google will ask you to **authorize** the script:
   - Click **Authorize access**
   - Choose your Google account
   - You'll see an "unverified app" warning — this is expected for personal scripts. Click **Advanced → Go to [project name] (unsafe)** → **Allow**.
   - This grants the script permission to edit your Sheet and send Gmail on your behalf.
6. After deployment, copy the **Web app URL** shown (it looks like `https://script.google.com/macros/s/AKfycb.../exec`). **Save this URL** — you'll need it in the next step.

### Re-deploying after future edits

If you ever edit `Code.gs` later, you must create a **new version**: go to **Deploy → Manage deployments → ✏️ Edit (pencil icon) → Version: New version → Deploy**. Simply saving the file does *not* update the live Web App.

---

## 🔗 Step 3 — Connect the form to your backend

1. Open `script.js` in this package.
2. Find this line near the top:
   ```javascript
   const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_SCRIPT_URL";
   ```
3. Replace `"YOUR_GOOGLE_SCRIPT_URL"` with the Web App URL you copied in Step 2, for example:
   ```javascript
   const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXXXXXX/exec";
   ```
4. Save the file.

That's the only configuration needed — the form will now POST directly to your Google Sheet.

---

## 📧 Step 4 — Confirm Gmail sending works

Gmail sending uses `GmailApp`, which runs under the same Google account you authorized in Step 2 — **no extra setup or API keys are required.** However, it's worth testing once before going live:

1. Back in the Apps Script editor, find the function dropdown near the top toolbar (next to the "Debug" button).
2. Select the function **`testDoPost`** from the dropdown.
3. Open `Code.gs` and edit the test email inside `testDoPost()` — replace `"your-test-email@example.com"` with an email address you can actually check.
4. Click **Run (▶)**.
5. Check that:
   - A new row appeared in your "Registrations" sheet tab.
   - The confirmation email arrived in the test inbox (check Spam folder on first run too).
6. If this is your **first ever run**, Google may again prompt for authorization — approve it the same way as Step 2.

Once this test passes, your backend is fully live and ready for real registrations.

---

## 🌐 Step 5 — Deploy the landing page to GitHub Pages

Since you typically deploy via the GitHub web UI rather than Git CLI, here's that exact flow:

1. Go to your GitHub organization/account (e.g. `U88game-cloud`) and click **New repository**.
2. Name it something like `seminar-cool-sir` or `wallstreet-experience`.
3. Set it to **Public** (required for free GitHub Pages).
4. Click **Create repository**.
5. On the new repo page, click **Add file → Upload files**.
6. Drag in all the files: `index.html`, `style.css`, `script.js`, and the entire `assets/` folder (with your real logo inside it).
   > Do **not** upload `Code.gs` or `README.md` to this repo if you'd rather keep your backend code private — they aren't needed for the live site to function. It's fine to include them too if you don't mind them being public.
7. Commit directly to the `main` branch.
8. Go to **Settings → Pages** (left sidebar).
9. Under "Build and deployment" → **Source**, select **Deploy from a branch**.
10. Under "Branch", select **main** and folder **/ (root)**, then click **Save**.
11. Wait 1–2 minutes, then refresh the page — GitHub will show your live URL, typically:
    ```
    https://U88game-cloud.github.io/seminar-cool-sir/
    ```
12. Visit that URL, fill out the form yourself once as a final live test, and confirm the row appears in your Google Sheet and the email arrives.

### Optional: custom domain

If you want a custom domain (e.g. `seminar.u88.com`), add a `CNAME` file to the repo root containing just your domain name, and point your domain's DNS A/CNAME records to GitHub Pages per [GitHub's custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

---

## 🎨 Design system reference

If you want to reuse this visual language for future U88/Cool Sir campaigns:

- **Navy:** `#0A1628` (deepest) → `#1B3A66` (lightest navy)
- **Gold:** `#C9A24B` (primary accent) / `#E3CC8E` (light gold highlight)
- **Paper (background):** `#FAF9F6` — warm off-white, not clinical white
- **Ink (body text):** `#16213A`
- **Fonts:** Fraunces (English display), Noto Serif TC (Chinese headlines), Inter / Noto Sans TC (body text), Roboto Mono (data/stats — financial terminal feel)
- **Signature visual motif:** the hero skyline illustration's roofline doubles as a stock candlestick chart line — this fuses the "Wall Street" and "skyline" concepts into one bespoke graphic rather than a generic gradient.

All of these are defined as CSS custom properties at the top of `style.css` (`:root { ... }`), so re-theming for another brand is a matter of editing values in one place.

---

## ⚡ Performance notes

This site is built with performance as a first-class requirement:

- **Zero JS frameworks or libraries** — vanilla JS only, ~11KB uncompressed.
- **No build step** — what you see is what ships; no bundler needed.
- **Fonts** load via `<link rel="preconnect">` to Google Fonts to minimize render-blocking delay.
- **Animations** use CSS transforms/opacity (GPU-accelerated) rather than layout-triggering properties, and respect `prefers-reduced-motion` for accessibility.
- **Images:** the only image asset is your logo — keep it reasonably small (a 200–400px wide PNG/SVG is plenty for a navbar logo) to preserve load speed.

With these characteristics, the page is architected to score above 90 on Lighthouse Performance, Accessibility, and Best Practices audits on real-world hosting (GitHub Pages serves static files over a fast CDN). Run your own Lighthouse audit after deployment (Chrome DevTools → Lighthouse tab) to confirm against your specific hosting and network conditions.

---

## 🛠 Troubleshooting

**"尚未连接后端" toast appears when submitting the form**
→ You haven't replaced `GOOGLE_SCRIPT_URL` in `script.js` yet. Go back to Step 3.

**Form submits but nothing appears in the Sheet**
→ Check that you deployed with "Execute as: Me" and "Who has access: Anyone" (Step 2). Also check the Apps Script editor's **Executions** log (left sidebar, clock icon) for error details.

**No confirmation email arrives**
→ Check Spam folder first. If still missing, re-run `testDoPost()` (Step 4) and check the Executions log for a Gmail-related error — this is almost always an authorization issue, fixable by re-running once and approving the permission prompt.

**Logo doesn't show up**
→ Double-check the filename and path match exactly (case-sensitive) between your uploaded asset and the `src` attributes in `index.html` (see Step 0).

**Changes to Code.gs don't seem to take effect**
→ You need to create a **new deployment version** after editing — see the note at the end of Step 2.

---

Built for **Cool Sir Edulife Academy** — 《华尔街投资体验》 © 2026
