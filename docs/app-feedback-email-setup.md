# Setting up App Feedback emails

Spec: [specs/app-feedback-emails.md](specs/app-feedback-emails.md). Script: [`tools/app-feedback-email.gs`](../tools/app-feedback-email.gs).

Never put the secret key or anyone's email address in this repo: it is public. They go only in the Script Properties (part A) and the webhook URL (part B).

## A. The Apps Script (signed in as the app's shared Gmail account)

1. Go to <https://script.google.com> → **New project**. Name it "OE Map Maker App Feedback emails".
2. Replace everything in `Code.gs` with the contents of `tools/app-feedback-email.gs`. Save.
3. **Project Settings** (gear icon) → **Script Properties** → add two properties, then **Save**:
   - `WEBHOOK_KEY`: a long random secret, letters and numbers only, at least 40 characters (use a password generator). Keep a copy: part B needs it.
   - `ALERT_TO`: the group's addresses, separated by commas, e.g. `first@example.com,second@example.com`.
4. Back in the editor, choose **`testSend`** in the function list → **Run**. Google asks for permission:
   **Review permissions** → choose the shared account → **Advanced** → **Go to … (unsafe)** → **Allow**.
   This is expected for your own script. Then check: the shared account's inbox has "We got your App Feedback", and every `ALERT_TO` address has "New App Feedback from Test Teacher".
5. **Deploy** → **New deployment** → gear → **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone** (Supabase cannot sign in to Google; the secret key protects it)
   
   **Deploy**, then copy the **Web app URL** (ends in `/exec`).

## B. The Supabase webhook (dashboard only, no SQL)

1. **Database → Webhooks** (enable Webhooks if asked) → **Create a new hook**.
2. Name: `app_feedback_emails`. Table: **`app_feedback`**. Events: **Insert** only.
3. Type: **HTTP Request**. Method: **POST**. URL: the Web app URL followed by `?key=` and the `WEBHOOK_KEY`, e.g.
   `https://script.google.com/macros/s/…/exec?key=YOUR_KEY`
4. Timeout: the maximum offered. Leave headers and parameters as they are. **Create webhook**.

## C. Check it

Send App Feedback from the live site as a Teacher. Within a minute:

- the Teacher's inbox has "We got your App Feedback" from **OE Map Maker**;
- every `ALERT_TO` address has "New App Feedback from <name>"; pressing Reply answers the Teacher.

If nothing arrives:

- **Apps Script → Executions**: was `doPost` run? An error there says why. "forbidden" in the response means the key in the URL does not match `WEBHOOK_KEY`.
- **Supabase → SQL Editor**: `select status_code, content, created from net._http_response order by created desc limit 5;` shows what the webhook got back.
- Gmail allows about 100 emails a day from a free account.

## Later

- **Changing the script:** edit, save, then **Deploy → Manage deployments → ✏️ → Version: New version → Deploy**. The URL stays the same.
- **Changing who gets alerts:** edit `ALERT_TO` in Script Properties. No new deployment needed.
- **Replies to receipts** land in the shared account's inbox. Set up forwarding in its Gmail settings if nobody checks it.
- **Turning emails off:** delete the webhook in Supabase. App Feedback keeps working.
