# Spec: App Feedback

Status: draft · Supabase (proposed, not applied) + front end · Tracked in GitHub issue #33 (tickets #34–#37)

## Problem Statement

Teachers using the app have no way to tell the people who build it that something is broken, confusing or missing. Today they would have to remember the problem, find one of us and describe it from memory, usually without saying which screen or Task it happened on. Problems go unreported, and those that are reported are hard to reproduce.

"Feedback" already means something in this app: the written comments and red-pen ink a Teacher leaves on a student's map, called a **Review**. This feature is different. It is about the app itself, never about a student's work, so it has its own name: **App Feedback**.

## Solution

A **Send App Feedback** button in the top bar, on every Teacher screen, opens a short form. The Teacher types a message about anything (a problem, an idea, a request) and can add up to three screenshots. The form shows what will be attached automatically: who they are, the time, the screen and Task they were on, and their browser and device. After Send, they see "Thanks, your App Feedback was sent."

App Feedback is stored in Supabase, where only people with access to the Supabase dashboard can read it. Teachers can add App Feedback but never read any, not even their own. The group checks the dashboard for new messages and deletes each one, with its screenshots, once it has been dealt with.

## User Stories

1. As a Teacher, I want a Send App Feedback button on every Teacher screen, so that I can report a problem from wherever it happens.
2. As a Teacher, I want to type a message about anything (a problem, an idea or a request) without picking a category, so that sending is quick.
3. As a Teacher, I want to add up to three screenshots by choosing files or pasting, so that I can show what I saw.
4. As a Teacher on an iPad, I want to choose screenshots from Photos, so that I can report problems from the device I teach with.
5. As a Teacher, I want to see what is attached automatically before I send, so that I know what I am sharing.
6. As a Teacher, I want a clear thank-you after sending, so that I know it arrived.
7. As a Teacher, I want to be told if sending fails, with my message still in the box, so that I can try again without retyping.
8. As a Teacher, I want screenshots to be refused with a clear reason if they are too big or not an image, so that I can fix it.
9. As a student or Guest, I never see the App Feedback button.
10. As the group, I want each App Feedback to say who sent it, when, from which screen and Task, and on which browser, so that we can reproduce problems and reply by email.
11. As the group, I want screenshots kept private to people with Supabase access, because they may show students' names or maps.
12. As the group, I want App Feedback kept even if the Teacher's account is later deleted, so that reports are not lost.
13. As the group, I want the privacy page to say what App Feedback collects and that it is deleted once dealt with, so that Teachers are informed.

## Implementation Decisions

- **Name:** App Feedback (see GLOSSARY.md). The word "feedback" never appears on its own in the UI, the code or the database.
- **Button:** "Send App Feedback" in the top bar, shown only while signed in as a Teacher (all Teacher screens: Dashboard, Gallery, reviewing). Hidden for students and Guests.
- **Form:** one message box (required, at most 2,000 characters), a screenshots picker, a read-only line listing what is attached automatically, and Cancel / Send.
- **Screenshots:** up to 3, PNG or JPG, at most 5 MB each. Chosen from files, or pasted with Ctrl+V / Cmd+V while the form is open. On iPad the picker offers Photos. Shown as small previews with a remove (✕) button. Checked in the form before anything is sent.
- **Attached automatically:** the Teacher's id, email and Teacher Name (copied as text at the time of sending), the time, the current screen (e.g. Dashboard, Gallery, Review) and the open Task's title and id if any, the page address and the browser/device (user agent).
- **Database (proposed SQL for Kiddy, not applied):**
  - A new table `app_feedback`: id, teacher id, teacher email, Teacher Name, message, screen, task id, task title, page address, user agent, screenshot paths, created at.
  - **Deleting an account must not delete App Feedback.** The teacher link is `on delete set null`, and the Task link is too. (Unlike Projects today, where deleting a sign-in deletes the Project.)
  - Message check: trimmed, 1–2,000 characters. At most 3 screenshot paths.
  - Access rules: a signed-in, non-anonymous user may **insert** a row only with their own teacher id. No read, update or delete rules for anyone through the app, so Teachers cannot read App Feedback, including their own. The dashboard (service role) sees everything.
  - A new **private** storage bucket `app-feedback`, limited to PNG/JPEG and 5 MB per file. Teachers may **upload** only, into a folder named after their own user id. No read rule.
  - Undo script and a read-only check, rehearsed on PGlite first, like earlier phases.
- **Sending order, so nothing half-arrives:** the page makes the App Feedback id itself, uploads each screenshot to `<user id>/<feedback id>/<n>.png|jpg`, and only if every upload succeeds inserts the row with those paths. If any step fails, the Teacher sees an error and their message and screenshots stay in the form. A failed send can leave orphan screenshots in storage; they are harmless and invisible to Teachers.
- **Insert without reading back:** because Teachers have no read rule, the insert must not ask Supabase to return the new row (no `.select()` after `.insert()`), or it will fail.
- **No history, no replies in the app.** The group replies by email if needed.
- **No notifications for now.** The group checks Table Editor → `app_feedback` in the Supabase dashboard. Screenshots are under Storage → `app-feedback`.
- **Privacy page:** a new row in the data table and a line in "who sees it": App Feedback (message, screenshots, Teacher's email and name, screen, Task, browser), seen only by the app's builders, deleted once dealt with.

## Testing Decisions

- **Database rehearsal on PGlite** with Supabase stand-ins: a Teacher can insert their own App Feedback; cannot insert with another teacher id; cannot read any App Feedback, including their own; an anonymous student cannot insert; a 2,001-character or blank message is refused; 4 screenshot paths are refused; deleting the Teacher's account keeps the row with the teacher id cleared; storage: Teacher can upload into their own folder only, cannot read; undo removes everything.
- **Front end, simulated:** form validation (empty message, too long, 4th screenshot, 6 MB file, non-image) and the sending order (an upload failure means no row is inserted, and the form keeps its contents).
- **Real checks** (after the SQL is applied):
  1. Signed in as a Teacher on the Dashboard: send a message with no screenshots → thank-you; the row appears in the dashboard with screen "Dashboard".
  2. From the Gallery with a Task open, paste a screenshot and send → the row has the Task, and the image opens in Storage.
  3. On an iPad, choose a screenshot from Photos and send.
  4. Turn off Wi-Fi and send → error, message kept; turn Wi-Fi on and send again.
  5. As a student, the button is not visible.

## Out of Scope

- Reading, replying to or tracking App Feedback inside the app.
- Email or chat notifications for new App Feedback.
- App Feedback from students or Guests.
- Categories (problem, idea, other).
- Automatic deletion after a time limit.

## Further Notes

- The repo is public: App Feedback must never be turned into GitHub issues automatically.
- Vocabulary follows GLOSSARY.md (Teacher, Teacher Name, Task, Review, Gallery, App Feedback).
