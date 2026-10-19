# Spec: My Projects updates live

Status: draft · Phase 1, item 2 · Front end only (no Supabase changes) · Tracked in [issue #3](https://github.com/akiddurrani-bit/Outdoor_Education_P5/issues/3)

## Problem Statement

A student waiting on their profile page has no way of knowing that their teacher has just Marked one of their Projects. The "Marked" badge and the "Teacher feedback available" note on My Projects only appear after the student presses Refresh or reloads the page. The same is true of other changes made elsewhere: a groupmate submitting the shared Project, or a classmate starting a Group Project that includes this student. In a lesson, students sit on a stale list and teachers have to tell them to press Refresh.

## Solution

While a student is on their profile page, My Projects quietly refreshes itself about every 10 seconds. When a Project becomes Marked, its card gains the "Marked" badge and feedback note, and the card is briefly highlighted with a short "New feedback on <Task>" message, so the student knows to open it. Other changes — status changing to Submitted, a new Group Project appearing — show up the same way. The list never flashes "Loading projects…" during these background refreshes, never jumps around, and never interrupts the student typing a Task Code. The Refresh button keeps working as before.

## User Stories

1. As a student on my profile page, I want a Project to show "Marked" as soon as my teacher saves a Review, so that I know feedback is waiting without pressing Refresh.
2. As a student, I want the change to appear within about 10 seconds, so that it feels instant.
3. As a student, I want a newly Marked Project to be briefly highlighted with "New feedback on <Task>", so that I notice which one changed.
4. As a student, I want the highlight to appear only when something actually changed, so that it stays meaningful.
5. As a student, I want to open the newly Marked Project straight from its card, as today, so that I can read the feedback right away.
6. As a student in a Group, I want the status to change to Submitted when a groupmate submits our Project, so that I know it has been handed in.
7. As a student, I want a Group Project a classmate started with me in it to appear in my list on its own, so that I can join without being told to refresh.
8. As a student, I want the list not to flash "Loading projects…" every 10 seconds, so that the page stays calm and readable.
9. As a student, I want the list not to re-order or jump while I am reading it, unless a Project's own activity moved it, so that I do not lose my place.
10. As a student typing a Task Code, I want the background refresh never to clear my typing or steal focus, so that I can start a Task normally.
11. As a student, I want the existing Refresh button to keep working and show the loading message as before, so that nothing I already know changes.
12. As a student, I want the checking to stop when I open a Project, so that the Project page's own feedback checking (instant feedback) takes over instead.
13. As a student, I want checking to stop when I switch student, sign out or close the page, so that it does not show someone else's Projects or waste data.
14. As a student who switches to another tab, I want checking to pause and catch up immediately when I come back, so that I see the latest state on return.
15. As a student with a weak connection, I want a failed refresh to keep showing my last list without an error message, and to try again next time, so that the page does not fill with errors.
16. As a Guest, I want My Projects to update live exactly as it does for Roster students, so that being a Guest is not a worse experience.
17. As a student, if my teacher clears a Review entirely, I want the "Marked" badge to disappear, so that the list matches what the teacher intends.
18. As a student whose Project was deleted by a teacher, I want it to disappear from my list on the next refresh, so that I do not try to open a Project that no longer exists.
19. As a Teacher, I want students waiting on their profile page to notice my feedback without me telling them, so that marking keeps the lesson moving.
20. As the group maintaining the app, I want this built without any Supabase change, so that it fits the rule that Supabase changes are proposed, not applied.
21. As Kiddy, I want this to reuse the existing My Projects loading and drawing, so that there is still one way the list is built.

## Implementation Decisions

- **Front end only.** Reuses the existing lookups behind My Projects: the Project history lookup (Roster-student and Guest versions) and the per-Project review lookup that decides whether a card is Marked. No new database functions, columns, policies or Realtime setup.
- **New piece: a My Projects watcher** for the profile page, with *start*, *stop* and *refresh now*. It mirrors the review watcher from the instant-feedback spec (issue #2); if both are built, they should share one small "repeat every N seconds while visible, never overlap" helper rather than two copies.
- **When it runs.** Starts when the profile page is shown for a Roster student or Guest. Stops when a Project is opened, the student switches, signs out, the teacher portal opens, or the page is closed or hidden. Pauses while the page is hidden; refreshes immediately when visible again. A refresh is skipped if the previous one has not finished.
- **How often.** About every 10 seconds, as agreed, via one named setting shared with the review watcher.
- **Quiet refresh vs. Refresh button.** The existing load path is split into "fetch the list" and "draw the list". The Refresh button keeps today's behaviour (loading message, then draw). Background refreshes fetch silently, and only redraw if the fetched list differs from what is on screen.
- **What counts as a change.** Compared per Project: whether it is Marked, the Review's last-saved time, the status, the last-activity time, and whether the Project is new or gone. Unchanged → nothing is redrawn.
- **Highlight.** A Project that is newly Marked, or whose Review was updated, gets a brief visual highlight on its card and a single "New feedback on <Task>" message in the profile area. Status changes and new/removed Projects update the card without a highlight.
- **Focus and input.** Redrawing touches only the My Projects list; the Task Code box and its contents are never touched, and keyboard focus is not moved.
- **Errors.** A failed background refresh keeps the last list on screen, logs to the console, and retries next interval. Only the Refresh button shows an error message, as today.
- **Load.** Each refresh is one history lookup plus one review lookup per Project. A student with 5 Projects makes about 6 small reads every 10 seconds while on the profile page. Students normally spend most of a lesson inside a Project, so this is acceptable for the free plan; the interval can be raised if needed.

## Testing Decisions

- **One seam, at the top: two real browsers**, same as issue #2. A good check only looks at what a person sees on screen. No test tooling added to the repo.
- **Where to test.** Only in a TEST Class with a TEST Task on the live database.
- **Prior art.** The instant-feedback checklist (issue #2); the edit lock's background renewal, verified by hand.
- **Checklist** (Browser A = Teacher, Browser B = student on the profile page):
  1. B sits on My Projects with an unmarked submitted Project. A saves a Review. Within ~10 s B's card shows "Marked", the feedback note, a highlight and "New feedback on <Task>".
  2. Nothing changes for 1 minute: no flashing "Loading projects…", no repeated highlight.
  3. A edits the Review. B's card highlights again once.
  4. B is half-way through typing a Task Code during a refresh. The text and cursor are untouched.
  5. Group: a groupmate (Browser C) submits. B's card changes to Submitted without a highlight.
  6. Browser C (a classmate) starts a new Group Project including B. It appears on B's list.
  7. A clears the Review completely and saves. B's "Marked" badge disappears.
  8. A deletes B's Project. It disappears from B's list.
  9. B presses Refresh: loading message appears briefly, as before.
  10. B opens a Project: My Projects checking stops (network panel), instant feedback checking starts.
  11. Repeat 1 as a Guest.
  12. B goes offline for 30 s, then back online: last list stays, no error text, next refresh succeeds.

## Out of Scope

- Instant feedback inside an open Project (issue #2).
- The Teacher's Student Maps list refreshing on its own (Phase 1, item 3).
- Warning a Teacher before overwriting a Review (Phase 1, item 4).
- "Resubmitted – awaiting review" (needs a Supabase change; Phase 2).
- Supabase Realtime, push or browser notifications, sounds.
- Changing what a card shows beyond the highlight and message.

## Further Notes

- Constraint: no Supabase change.
- Delivery: built on `amos-branch`, merged by Kiddy via pull request; Netlify deploys `main`.
- Build after issue #2 so both watchers can share one helper.
- Vocabulary follows GLOSSARY.md (Project, Review, Marked, Submitted, Group, Guest).
