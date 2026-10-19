# Spec: Warn before overwriting a Review

Status: draft · Phase 1, item 4 · Front end only (no Supabase changes) · Small, demo-driven · Tracked in [issue #5](https://github.com/akiddurrani-bit/Outdoor_Education_P5/issues/5)

## Problem Statement

In the live demo, five Teachers share one Class. If two of them open the same Project and both save a Review, the second save silently replaces the first — the first Teacher's red ink and feedback are gone and nobody knows. In normal use each Teacher runs their own lessons and Tasks, so this is rare, but during the demo it is likely enough to lose real work in front of the audience.

## Solution

When a Teacher presses "Save feedback + ink", the app first checks whether the Review was saved by someone else after this Teacher opened it. If not, it saves as today. If it was, the Teacher sees: "Another Teacher saved this Review at 10:42, after you opened it. Saving will replace their ink and feedback. Save anyway?" — and can either save anyway or cancel and keep their own work on screen. Nothing else about marking changes.

## User Stories

1. As a Teacher, I want to be warned before my save replaces a Review someone else saved after I opened it, so that I do not wipe a colleague's marking without knowing.
2. As a Teacher, I want the warning to tell me when the other save happened, so that I can judge whether it matters.
3. As a Teacher, I want to choose "save anyway", so that I can still overwrite when I mean to.
4. As a Teacher, I want "cancel" to leave my ink and feedback on screen untouched, so that I can copy or rethink before deciding.
5. As a Teacher, I want no warning when nobody else saved in between, so that normal marking is not slowed down.
6. As a Teacher saving the same Review several times in a row, I want no warning against my own earlier saves, so that repeated saving stays smooth.
7. As a Teacher who opened a Project with no Review, I want a warning if a colleague creates one before I save, so that the first Review is not lost either.
8. As a Teacher, I want the check to fail safe — if it cannot be done (e.g. connection problem), I want to be told and asked whether to save anyway, so that I never overwrite blindly.
9. As a demo participant acting as a student, I want the marking I see not to flip between two Teachers' versions, so that the demo makes sense.

## Implementation Decisions

- **Front end only.** Uses the Review's existing last-saved time. The review screen already reads the Review when it opens; it will also remember that last-saved time (or "none"). No database changes.
- **Check before save.** On "Save feedback + ink", re-read the Review's last-saved time. If it differs from the remembered one, show the confirmation; otherwise save straight away. After any successful save, remember the new last-saved time, so the same Teacher's next save does not warn.
- **Wording.** Says "another Teacher", not a name, because Teacher accounts have no display names set. If the same Teacher has the Project open in two tabs, they will also be warned — acceptable.
- **Cancel.** Does nothing; the Teacher's unsaved ink and feedback stay on screen. They can go back to the dashboard and reopen the Project to see the colleague's version.
- **Fail safe.** If the check itself fails, ask "Could not check for other Teachers' changes. Save anyway?" instead of saving silently.
- **Known gap, accepted.** Two Teachers pressing Save within the same second can still overwrite each other; closing that fully would need a database change and is not worth it for a demo.

## Testing Decisions

- **One seam, at the top: two Teacher browsers.** Checks look only at what a Teacher sees. No test tooling added.
- **Where to test.** Only in a TEST Class with a TEST Task.
- **Checklist** (Browsers A and C = two Teachers, same Project):
  1. A opens the Project and saves. No warning.
  2. A saves again twice. No warning.
  3. A and C open the same Project. C saves. A then saves: warning shows C's save time.
  4. A cancels: A's ink and feedback stay on screen; nothing is saved.
  5. A saves anyway: A's version is saved; C reopening the Project sees A's version.
  6. Project with no Review: A and C open it; C saves first; A's save shows the warning.
  7. A goes offline and saves: the fail-safe question appears.

## Out of Scope

- Showing which Teacher saved (needs display names).
- Merging two Teachers' ink, or keeping a history of Review versions.
- Locking a Project while a Teacher is marking it.
- Any change to how students see Reviews.

## Further Notes

- Kept deliberately small: shared marking of one Class is a demo arrangement, not how Teachers will normally use the app.
- Delivery: `amos-branch` → pull request → Kiddy merges → Netlify deploys `main`.
- Vocabulary follows GLOSSARY.md (Teacher, Project, Review).
