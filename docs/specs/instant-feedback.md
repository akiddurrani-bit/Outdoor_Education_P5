# Spec: Instant feedback for students

Status: draft · Phase 1, item 1 · Front end only (no Supabase changes) · Tracked in [issue #2](https://github.com/akiddurrani-bit/Outdoor_Education_P5/issues/2)

## Problem Statement

When a Teacher saves a Review, the student does not find out. The red-pen ink and written feedback only appear if the student closes and reopens the Project, presses Refresh on My Projects, or reloads the page. In a lesson this breaks the feedback loop the app is meant to support: the Teacher marks, but students keep drawing without seeing the comments, and the Teacher has to tell them out loud to reopen their work. The same applies when a Teacher edits a Review they already saved — the student keeps seeing the old version.

## Solution

While a student has a Project open, the app quietly checks for that Project's Review about every 10 seconds. As soon as a Teacher saves a new or updated Review, the student's screen shows it — the red ink appears over their map, the Teacher Feedback panel shows the latest written feedback and time, and a small "Teacher feedback updated" note tells them something changed. The student does not need to press anything, and their own drawing is never interrupted or changed. This works the same for Roster students and Guests, and on both the Editor device and View-only devices of a Group's Project.

## User Stories

1. As a student, I want my teacher's Review to appear on my open Project without reloading, so that I can act on feedback during the lesson.
2. As a student, I want to see feedback within about 10 seconds of my teacher saving it, so that it feels instant.
3. As a student, I want a small "Teacher feedback updated" note when a Review arrives or changes, so that I notice it even if I was busy drawing.
4. As a student, I want the note not to block my screen or require a click, so that it never interrupts my work.
5. As a student, I want the red ink to appear over my map in the same place the teacher drew it, so that I can see exactly what they meant.
6. As a student, I want the written feedback text and the "Reviewed <time>" line to update to the latest version, so that I never read outdated comments.
7. As a student, I want the Teacher Feedback panel to appear on its own the first time my Project is Marked, so that I do not have to know where to look.
8. As a student, I want my own map, my undo/redo history and anything I am in the middle of drawing to stay exactly as they are when feedback arrives, so that I never lose work.
9. As a student who has pressed "Hide teacher markings", I want my choice respected when the Review is updated, so that the ink does not suddenly cover my map while I am working — but I still want the note so I know there is something new.
10. As a student, I want to be able to show the updated markings again with the existing button, so that I can look at them when I am ready.
11. As a student in a Group, I want every member's device — the Editor and any View-only devices — to receive the Review, so that the whole Group sees the same feedback.
12. As a Guest, I want instant feedback to work exactly as it does for Roster students, so that being a Guest does not mean a worse experience.
13. As a student, I want feedback to keep arriving if my teacher saves the Review several times, so that I always see the newest edits.
14. As a student, if my teacher clears all ink and feedback and saves, I want the Teacher Feedback panel to disappear, so that the screen matches what the teacher intends.
15. As a student, I want the app to stop checking when I leave the Project (back to My Projects, switch student, close the tab), so that it does not waste data or show feedback for the wrong Project.
16. As a student who switches to another browser tab, I want checking to pause, and to catch up straight away when I come back, so that I see the latest Review immediately on return.
17. As a student with a weak connection, I want a failed check to fail silently and try again next time, so that I do not get error pop-ups during the lesson.
18. As a student, I want the note to say the feedback was updated without repeating it every 10 seconds when nothing has changed, so that the note stays meaningful.
19. As a Teacher, I want students to see my Review moments after I press "Save feedback + ink", so that I can mark one group and move on while they start improving.
20. As a Teacher, I want to be able to correct a Review and know the students will see the corrected version, so that a mistake is not stuck on their screen.
21. As a Teacher running a class of about 25 students, I want this checking to be light enough that the free database plan copes, so that the lesson is not disrupted.
22. As the group maintaining the app, I want this built without any Supabase change, so that it fits the rule that Supabase changes are proposed, not applied.
23. As Kiddy, I want this to reuse the existing review lookup used when a Project opens, so that there is one way of reading a Review, not two.

## Implementation Decisions

- **Front end only.** Uses the existing review lookups the app already calls when opening a Project — the Roster-student lookup and the Guest lookup. No new database functions, columns, policies or Realtime setup. (Supabase Realtime is switched off for every table; turning it on would be a Supabase change.)
- **New piece: a review watcher** inside the student workspace. It has three operations: *start watching* a given Project, *stop watching*, and *check now*. It is the only new concept; everything it does on screen goes through the existing "apply review to the screen" behaviour.
- **When it runs.** Starts when a student (Roster or Guest) finishes opening a Project in the student workspace, on Editor and View-only devices alike. Stops on every way of leaving: back to My Projects, switching student, signing out, entering the teacher portal, closing or hiding the page. Only ever watches one Project at a time; starting a new one replaces the old.
- **How often.** One check about every 10 seconds, as agreed. The interval is a single named setting so it can be tuned. Checks pause while the page is hidden and an immediate check runs when it becomes visible again. A new check is skipped if the previous one has not finished.
- **What counts as a change.** The watcher remembers the Review it last showed (its last-saved time plus its content). Nothing happens on screen unless the newly fetched Review differs. Three outcomes: a Review appears where there was none; an existing Review is updated; a Review becomes empty (teacher cleared everything) — handled the same way as opening a Project with no Review.
- **What changes on screen.** Only the Review: the ink layer, the feedback text, the "Reviewed <time>" line and the show/hide button. The student's map, selection, undo/redo history, any half-drawn shape or Route, and the autosave are untouched. The edit lock is unaffected.
- **Hide/show choice is kept.** The existing apply-review behaviour currently forces markings visible. For updates arriving while the Project is open, the student's current hide/show choice is kept; when hidden, the stored Review is still updated so pressing "Show teacher markings" shows the latest ink.
- **The note.** A short, non-blocking "Teacher feedback updated" message using the existing status area, shown once per actual change. No sound, no pop-up.
- **Errors.** A failed check is logged to the console only and retried at the next interval. No alerts.
- **Load.** About 6 requests per minute per open Project. A class of 25 students ≈ 150 small reads per minute — acceptable for the current free plan.

## Testing Decisions

- **One seam, at the top: two real browsers.** The repo has no automated tests and this feature lives entirely in the page, so it is verified by a written manual check rather than adding test tooling to Kiddy's repo. A good check only looks at what a person sees on screen, never at internal variables.
- **Where to test.** Only in a dedicated TEST Class and TEST Task on the live database (there is no separate test database). Never in TG1 during a real session.
- **Prior art.** None in the repo. The closest existing behaviour, the edit lock's background renewal, was also verified by hand with two devices.
- **Checklist** (Browser A = Teacher, Browser B = student; use a private window for one of them):
  1. B opens a Project with no Review. A saves ink + feedback. Within ~10 s B shows the ink, feedback, time and the note.
  2. A edits the feedback and saves again. B updates within ~10 s; the note appears once.
  3. Nothing changes for 1 minute. B shows no repeated notes.
  4. B is mid-way through drawing a shape when A saves. The shape and B's undo history are intact.
  5. B presses "Hide teacher markings"; A saves new ink. B stays hidden, shows the note; pressing Show reveals the new ink.
  6. A clears all ink and feedback and saves. B's Teacher Feedback panel disappears.
  7. Group Project: B is the Editor and a third browser C is View-only. Both receive the Review.
  8. Repeat 1 as a Guest.
  9. B switches to another tab, A saves, B switches back. B updates almost immediately.
  10. B returns to My Projects. The browser's network panel shows checks stop.
  11. B goes offline briefly (devtools → Offline) for 30 s, then back online. No error pop-ups; the next check succeeds.

## Out of Scope

- My Projects list showing "Marked" live (Phase 1, item 2).
- The Teacher's Student Maps list refreshing on its own (Phase 1, item 3).
- Warning a Teacher before overwriting another Teacher's Review (Phase 1, item 4).
- "Resubmitted – awaiting review" (needs a Supabase change; Phase 2).
- Supabase Realtime, push notifications, sounds or browser notifications.
- Feedback for Projects the student does not currently have open.
- Any change to how Teachers write or save Reviews.

## Further Notes

- Constraint: Supabase is Kiddy's live backend; this spec deliberately needs no Supabase change.
- Delivery: built on `amos-branch`, reviewed and merged by Kiddy through a pull request; Netlify then deploys `main`.
- Separately, the header test line "test for akid to observe changes" is live on the site after PR #1 and should be removed (Step 0) — not part of this spec.
- Vocabulary follows GLOSSARY.md (Project, Review, Marked, Group, Editor, View-only, Guest).
