# Spec: Teacher's Student Maps list updates live

Status: draft · Phase 1, item 3 · Front end only (no Supabase changes) · Tracked in [issue #4](https://github.com/akiddurrani-bit/Outdoor_Education_P5/issues/4)

## Problem Statement

During a lesson a Teacher has a Task open on the dashboard and wants to see work come in. Today the Student Maps list only changes when the Teacher presses Refresh, so new Projects, newly Submitted Projects and fresh activity are invisible until they remember to. The list also does not say which Projects are already Marked, so with five Teachers sharing a Class nobody can tell at a glance what still needs marking. Simply refreshing the current list automatically would make things worse: it is ordered by most recent activity, and students autosave constantly, so rows would keep swapping places under the Teacher's mouse — next to a Delete button.

## Solution

While a Teacher is looking at a Task's Student Maps list, it quietly refreshes about every 10 seconds. New Projects appear, statuses change to Submitted, and each row shows whether the Project is Marked and when. Rows stay in a stable order (by Class, then Group or student name) so nothing moves under the Teacher's cursor; only new Projects are added into their place. A newly Submitted Project is briefly highlighted. The Refresh button keeps working.

## User Stories

1. As a Teacher with a Task open, I want new Projects to appear in Student Maps on their own, so that I can see who has started without pressing Refresh.
2. As a Teacher, I want a Project's status to change to Submitted within about 10 seconds of a student submitting, so that I can start marking straight away.
3. As a Teacher, I want a newly Submitted Project to be briefly highlighted, so that I notice it among many rows.
4. As a Teacher, I want each row to show "Marked" and the time it was last marked, so that I can see what still needs marking.
5. As one of several Teachers sharing a Class, I want to see that a colleague has already Marked a Project, so that we do not mark the same work twice.
6. As a Teacher, I want rows to stay in the same place while I am looking at the list, so that I never click Review or Delete on the wrong Project.
7. As a Teacher, I want rows ordered by Class, then Group or student name, so that I can find a particular student quickly and the order is predictable.
8. As a Teacher, I want a new Project to slot into its alphabetical place rather than pushing everything down from the top, so that the list stays stable.
9. As a Teacher, I want the last-activity time on each row to keep updating, so that I can see who is actively working.
10. As a Teacher, I want a deleted Project to disappear from the list on the next refresh, including one deleted by another Teacher, so that the list is accurate.
11. As a Teacher, I want the list not to flicker or redraw when nothing has changed, so that it is calm to read.
12. As a Teacher, I want the existing Refresh button to keep working, so that I can force an update.
13. As a Teacher, I want refreshing to stop when I open a Project to review it, so that it does not do work I cannot see.
14. As a Teacher, I want refreshing to start again when I return to the dashboard, so that I see what changed while I was marking.
15. As a Teacher, I want refreshing to follow whichever Task I select, so that I never see one Task's Projects under another Task.
16. As a Teacher, I want refreshing to stop on the Classes tab, when I sign out, or when I close or hide the page, so that it does not waste data.
17. As a Teacher who switches tabs, I want the list to catch up immediately when I come back, so that I see the latest state.
18. As a Teacher on a weak connection, I want a failed refresh to keep showing the last list without an error, so that the list does not suddenly disappear.
19. As a Teacher, I want a Delete confirmation I have open not to be affected by a refresh, so that I am confirming the Project I meant.
20. As the group maintaining the app, I want this built without any Supabase change, so that it fits the rule that Supabase changes are proposed, not applied.

## Implementation Decisions

- **Front end only.** Reuses the dashboard's existing direct read of a Task's Projects. Marked information comes from a read of the Reviews for those Projects, which Teachers are already allowed to read. No new database functions, columns, policies or Realtime setup.
- **Shared repeat helper.** Uses the same "repeat every N seconds while visible, never overlap" helper as issues #2 and #3, with the same single interval setting (about 10 seconds).
- **When it runs.** Starts when a Task is selected on the Tasks tab and its Student Maps list is shown. Restarts for a different Task when the selection changes. Stops when the Teacher opens a Project for review, switches to the Classes tab, signs out, or the page is closed or hidden; pauses while hidden and refreshes immediately when visible again.
- **Stable order (behaviour change).** The list is ordered by Class name, then Group name or student name, instead of most-recent-activity first. This applies to the Refresh button and first load too, so the order never differs between manual and automatic refreshes.
- **Marked on each row.** A row shows "Marked · <time>" when its Project has a Review, using the Review's last-saved time. No teacher name is shown, because Teacher accounts currently have no display names set.
- **Quiet updates.** Background refreshes only change rows whose data changed (status, last activity, Marked, or row added/removed); untouched rows keep their elements, so buttons do not move or lose hover. Nothing is redrawn when nothing changed.
- **Highlight.** A Project that changes to Submitted, or is newly added, gets a brief highlight. Other changes update silently.
- **Delete safety.** Each row's Delete and Review buttons stay tied to that row's own Project, and the browser's confirmation dialog pauses the page while open, so a refresh cannot swap the target.
- **Errors.** A failed background refresh keeps the current list, logs to the console and retries next interval. Only the Refresh button and first load show an error message, as today.
- **Load.** Two small reads every 10 seconds per Teacher with a Task open; with five Teachers this is negligible.

## Testing Decisions

- **One seam, at the top: two real browsers**, as in issues #2 and #3. Checks look only at what a person sees. No test tooling added.
- **Where to test.** Only in a TEST Class with a TEST Task.
- **Prior art.** The checklists in issues #2 and #3.
- **Checklist** (Browser A = Teacher with the TEST Task open, Browser B = student):
  1. B starts a new Project. It appears in A's list in its alphabetical place within ~10 s, briefly highlighted.
  2. B draws for a minute. A's rows do not change order; only B's last-activity time updates.
  3. B submits. B's row changes to Submitted with a highlight.
  4. A (or a second Teacher, Browser C) saves a Review for B. B's row shows "Marked · <time>" in every Teacher's list.
  5. Nothing changes for 1 minute: no flicker, no highlights.
  6. A hovers over a row's Delete button through several refreshes: the button does not move.
  7. A opens the Delete confirmation for B, waits 20 s, cancels: nothing else was deleted, the list is unchanged.
  8. C deletes a Project. It disappears from A's list.
  9. A opens B's Project for review: refreshing stops (network panel). A returns to the dashboard: list catches up immediately.
  10. A switches to another Task: only that Task's Projects show, and refreshing follows it.
  11. A goes offline for 30 s, then back: last list stays, no error, next refresh succeeds.

## Out of Scope

- Instant feedback for students (issue #2) and live My Projects (issue #3).
- Warning before overwriting another Teacher's Review (Phase 1, item 4).
- "Resubmitted – awaiting review" (needs a Supabase change; Phase 2).
- Showing which Teacher marked a Project (needs Teacher display names).
- Filtering or searching the list, or choosing a different sort order.
- Supabase Realtime, notifications or sounds.

## Further Notes

- The switch from most-recent-first to alphabetical order is a deliberate behaviour change that Kiddy should agree to in review; it exists because a live list ordered by activity would move rows under the Teacher's cursor.
- Build after issues #2 and #3 to reuse the shared repeat helper.
- Delivery: `amos-branch` → pull request → Kiddy merges → Netlify deploys `main`.
- Vocabulary follows GLOSSARY.md (Teacher, Task, Project, Review, Marked, Submitted, Group, Class).
