# Spec: App Feedback emails

Status: draft · Google Apps Script + Supabase Database Webhook (dashboard only) + privacy page · Tracked in GitHub issue #39
Builds on [app-feedback.md](app-feedback.md).

## Problem Statement

App Feedback works, but nobody is told when it arrives: the group has to keep checking the Supabase dashboard, so messages can sit unread. Teachers get only an on-screen thank-you, with nothing to keep, and no easy way to add to what they sent.

## Solution

Every new App Feedback sends two emails from the app's shared Gmail account, shown as **OE Map Maker**:

- a **receipt** to the Teacher, with a copy of their message; replying reaches the group;
- an **alert** to the group, with everything needed to act on it; replying answers the Teacher.

Supabase calls a small Google Apps Script for each new App Feedback, and the script sends both emails. It is free and needs no domain of our own.

## User Stories

1. As a Teacher, I want an email receipt with a copy of my App Feedback, so that I have a record of what I sent.
2. As a Teacher, I want to reply to the receipt to add something, so that I don't have to send a second App Feedback.
3. As the group, I want an email for each new App Feedback, so that we don't have to keep checking the dashboard.
4. As the group, I want the alert to show who sent it, when, from which screen and Task, the message, and where the screenshots are, so that we can act without opening Supabase first.
5. As the group, I want Reply on an alert to answer the Teacher directly.
6. As a Teacher, I want my App Feedback saved even if the emails fail, so that nothing is lost.
7. As the group, I want screenshots kept out of email, because they may show students' names and email copies are hard to delete.
8. As the group, I want only Supabase to be able to make the script send email, so that nobody can use our account to send spam.

## Implementation Decisions

- **Sending:** a Google Apps Script web app (`tools/app-feedback-email.gs`) deployed on the shared Gmail account, "Execute as: Me", "Anyone" can call it. Gmail's free limit is about 100 emails a day, far above our use.
- **Trigger:** a Supabase **Database Webhook** on `app_feedback`, **Insert** only, POSTing the new row to the script. Dashboard setup only, no SQL.
- **Secret key:** the script only acts when the URL carries `?key=` matching its `WEBHOOK_KEY` Script Property (Apps Script cannot read request headers). The key exists only in Script Properties and the webhook URL.
- **No secrets or personal addresses in the repo:** `WEBHOOK_KEY` and `ALERT_TO` (the group's addresses, comma-separated) are Script Properties.
- **Receipt:** to the row's `teacher_email`. Subject "We got your App Feedback". Body: a greeting by Teacher Name, the message quoted, the number of screenshots, "Reply to this email if you want to add anything." Replies go to the shared account's inbox.
- **Alert:** to `ALERT_TO`. Subject "New App Feedback from <Teacher Name>". Body: name and email, time, screen, Task, browser, the message quoted, the number of screenshots and their Storage paths, and the App Feedback id. **Reply-To** is the Teacher's email.
- **No attachments or image links** in either email.
- **Each email is tried on its own:** a failed alert never stops the receipt, and the reverse. Emails never block saving: the webhook runs after the row is saved, and the page does not wait for it. Failures show in Apps Script → Executions.
- **Ignored:** anything that is not an Insert on `app_feedback`, malformed bodies, a missing Teacher email (alert only).
- **Privacy page:** says a receipt and an alert are emailed, and that the group deletes the alert email when it deletes the App Feedback.
- **Setup and maintenance steps:** [docs/app-feedback-email-setup.md](../app-feedback-email-setup.md).

## Testing Decisions

- **Script logic, in Node with stand-ins for Gmail and Script Properties: 14/14.** Both emails sent with the agreed recipients, subjects, sender name and Reply-To; message, screen, Task and Storage paths in the alert; no attachments; wrong or missing key sends nothing; other tables and updates ignored; bad JSON handled; a failed alert still sends the receipt; no Teacher email sends the alert only; missing `ALERT_TO` still sends the receipt.
- **Real checks** (after setup):
  1. `testSend` from the editor: both test emails arrive.
  2. App Feedback from the live site: receipt to the Teacher and alert to the group within a minute.
  3. Reply to the alert: it goes to the Teacher. Reply to the receipt: it reaches the shared inbox.
  4. Calling the web app URL without the key does nothing ("forbidden").
  5. Delete the webhook: App Feedback still saves, with no emails.

## Out of Scope

- Screenshots in emails, or links to them.
- Emails for anything other than new App Feedback.
- A domain of our own, or a paid email service.
- Students or Guests.

## Further Notes

- The repo is public: never commit the key, the web app URL with its key, or the group's addresses.
