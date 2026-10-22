# Spec: Gallery — every student's map for a Task, at a glance

Status: draft · Front end only (no Supabase changes) · Tracked in [issue #16](https://github.com/akiddurrani-bit/Outdoor_Education_P5/issues/16)

## Problem Statement

During a lesson a Teacher wants to see how the whole class is getting on. Today the only way to see a student's map is to open their Project one at a time from the Student Maps list, look, close it, and open the next. With thirty or more Projects for a Task, the Teacher cannot tell at a glance who has barely started, who is stuck, who is nearly done, or whose work looks different from everyone else's.

## Solution

A **Gallery** button in the Student Maps panel opens a page showing every Project for the selected Task side by side as small maps. Each tile shows the student's map, with the Group or student name, the Class, the state (being drawn, Submitted, Marked) and how long ago it last changed. The Gallery changes as students draw, within about 10 seconds, with no Refresh button. Clicking a tile opens that Project in the existing Review screen: a Project still being drawn can only be watched; one that is Submitted can be marked. Closing the Review screen returns to the Gallery. The Gallery is for Teachers only and has no actions of its own.

## User Stories

1. As a Teacher with a Task selected, I want a Gallery button in the Student Maps panel, so that I can see every student's map for that Task in one place.
2. As a Teacher, I want the Gallery to show only the selected Task's Projects, so that I am comparing maps of the same site.
3. As a Teacher whose Task is set for several Classes, I want the Gallery to include Projects from every one of those Classes, so that I see the whole Task.
4. As a Teacher, I want the Gallery to include Projects that are still being drawn, so that I can check progress in the middle of a lesson.
5. As a Teacher, I want Submitted and Marked Projects in the Gallery too, so that I see everything in one view.
6. As a Teacher, I want each tile to show the student's map — Landmarks, Routes and North Arrow — so that I can judge the work itself.
7. As a Teacher, I want tiles to leave out the Legend, the Reference Map and any red-pen Review ink, so that the small maps stay readable and show only the student's own work.
8. As a Teacher, I want each tile labelled with the Group or student name, so that I know whose map it is.
9. As a Teacher, I want each tile labelled with the Class, so that I can tell apart students with the same name in different Classes.
10. As a Teacher, I want each tile to show whether the Project is being drawn, Submitted or Marked, so that I know what still needs marking.
11. As a Teacher, I want each tile to show how long ago it last changed, so that I can spot students who have stopped working.
12. As a Teacher, I want tiles ordered by Class, then Group or student name, with a heading for each Class, so that I can find a particular student quickly.
13. As a Teacher, I want the Gallery order to match the Student Maps list, so that moving between them is predictable.
14. As a Teacher, I want every tile the same size, about four to five per row on a laptop, so that the Gallery is easy to scan.
15. As a Teacher, I want each map shrunk to fit its tile whole, with its North Arrow, so that I see the full map, not a cropped corner.
16. As a Teacher, I want a tile whose Project has nothing drawn yet to say "Nothing drawn yet", so that I can tell an empty map from a broken one.
17. As a Teacher, I want the maps to change as students draw, within about 10 seconds, so that I can watch the lesson unfold without pressing anything.
18. As a Teacher, I want no Refresh button, so that I never have to remember to update the Gallery.
19. As a Teacher, I want a newly started Project to appear in its alphabetical place while the Gallery is open, so that I see who has just begun without the other tiles jumping around.
20. As a Teacher, I want a tile to flash briefly when its Project is newly started or just Submitted, so that I notice it among many tiles.
21. As a Teacher, I want a tile's state to change to Marked when any Teacher saves a Review for it, so that colleagues sharing the Class do not mark the same work twice.
22. As a Teacher, I want a deleted Project to disappear from the Gallery, including one deleted by another Teacher, so that the Gallery is accurate.
23. As a Teacher, I want tiles that have not changed to stay exactly as they are, without flicker or redraw, so that the Gallery is calm to look at.
24. As a Teacher, I want to click a tile to open that Project in the existing Review screen, so that I can look at it in detail.
25. As a Teacher, I want a tile for a Project still being drawn to open watch-only, exactly as the Review button does today, so that I can follow a student closely without being able to mark unfinished work.
26. As a Teacher, I want a tile for a Submitted Project to open ready for marking, so that I can go straight from the Gallery to a Review.
27. As a Teacher, I want closing the Review screen to bring me back to the Gallery, so that I can carry on looking across the class.
28. As a Teacher, I want the Gallery to catch up immediately when I return to it from the Review screen, so that I see what changed while I was away.
29. As a Teacher, I want the Gallery to take over the page, with a Back button to Student Maps, so that the maps have as much room as possible.
30. As a Teacher, I want the Gallery to have no Delete or hand-in buttons, so that I cannot remove or submit someone's work by accident while scanning.
31. As a Teacher, I want the Gallery button to say "Gallery", not "Review all", so that I do not think it marks everyone at once.
32. As a Teacher, I want the Gallery to stop updating when I leave it, sign out, or hide or close the page, so that it does not waste data.
33. As a Teacher who switches browser tabs, I want the Gallery to catch up immediately when I come back, so that I see the latest state.
34. As a Teacher on a weak connection, I want a failed update to keep showing the last maps without an error, so that the Gallery does not suddenly empty.
35. As a Teacher, I want the Gallery to show only Projects from Classes I am a Teacher of, so that it follows the same rules as the rest of the dashboard.
36. As a student, I never want to see the Gallery or other students' maps, so that my work is seen only by my Group and my Teachers.
37. As the group maintaining the app, I want this built without any Supabase change, so that it fits the rule that Supabase changes are proposed, not applied.

## Implementation Decisions

- **Front end only.** Teachers can already read every Project's map data for their own Classes; the Gallery uses the same direct reads as the Student Maps list and the Review screen. No new database functions, columns, policies or Realtime setup.
- **New module: small map renderer.** The existing map drawing (Landmarks, Routes, North Arrow) draws only into the single editor canvas from the editor's own state. A new piece is extracted that takes one Project's map data and draws it, read-only, into a given small box, scaled to fit the whole map. It never touches the editor's state. It draws no Legend, Reference Map, selection handles or Review ink. The editor's own drawing should reuse the same shape and Route drawing so the two cannot drift apart; if that proves too invasive, the renderer may duplicate the drawing but must produce the same picture.
- **Where it runs.** The Gallery button appears in the Student Maps panel only while a Task is selected on the Tasks tab, and only on the Teacher dashboard. It opens a full-page Gallery view with a Back button returning to Student Maps for the same Task.
- **Live updates.** Uses the shared "repeat every N seconds while visible, never overlap" live-check helper with the same single interval setting (about 10 seconds) already used by the Student Maps list and the Review screen. Each check reads the cheap list of the Task's Projects (id, names, Class, state, last-changed time) plus Marked information, as the Student Maps list does, then downloads map data **only** for Projects that are new or whose last-changed time moved since the last check. With students saving about a second after each change, a Teacher sees a change within about 10 seconds.
- **When it runs.** Starts when the Gallery opens. Stops when the Teacher goes Back, opens a Project from a tile, switches to the Classes tab, signs out, or the page is closed or hidden; pauses while hidden and checks immediately when visible again or when the Teacher returns from the Review screen. The Student Maps list's own live check does not need to run while the Gallery is showing.
- **Stable order.** The same ordering as the Student Maps list (Class name, then Group name or student name), grouped under a heading per Class. New Projects are inserted in place; nothing else moves.
- **Quiet updates.** Only tiles whose data changed are redrawn; untouched tiles keep their elements. Nothing is redrawn when nothing changed.
- **Highlight.** A tile flashes briefly when its Project is newly added or changes to Submitted, matching the Student Maps list. Other changes update silently.
- **Tile contents.** Map (or "Nothing drawn yet" when it has no Landmarks or Routes), Group or student name, Class, state label (being drawn / Submitted / Marked), and relative last-changed time that keeps updating.
- **Opening a tile.** Calls the same path as the list's Review button. The Review screen remembers it was opened from the Gallery so that closing it returns to the Gallery rather than the list. Watch-only versus markable behaviour is unchanged and comes from the Review screen itself.
- **No actions.** The Gallery has no Delete, hand-in or Review-saving controls.
- **Errors.** A failed background check keeps the current tiles, logs to the console and retries next interval. Only the first load shows an error message if it fails.
- **Load.** One small list read every ~10 seconds per Teacher with the Gallery open, plus map data only for Projects that changed. In a busy lesson with thirty students drawing, that is up to thirty map downloads per interval for one Teacher — acceptable for a handful of Teachers; if it proves heavy, Realtime can be proposed to Kiddy separately.

## Testing Decisions

- **One seam, at the top: two real browsers**, as in the earlier specs (live Student Maps, instant feedback, live My Projects). Checks look only at what a person sees. No test tooling added.
- **The small map renderer is tested through the Gallery**, by comparing tiles to the same Projects opened full size, not with separate code tests.
- **Where to test.** Only in a TEST Class with a TEST Task.
- **Prior art.** The checklists in the live Student Maps spec and issues #2–#4.
- **Checklist** (Browser A = Teacher with the TEST Task's Gallery open, Browser B and C = students):
  1. With no Task selected, there is no Gallery button. Select the TEST Task: the button appears in Student Maps. Students never see it.
  2. Open the Gallery: one tile per Project, grouped by Class, same order as the list, Back button present, no Delete or hand-in buttons.
  3. Open a Project with Landmarks (fixed and freehand), Paths, Roads and a rotated North Arrow full size; its tile shows the same map, whole, without Legend or Review ink.
  4. B starts a new Project: within ~10 s it appears in its alphabetical place, says "Nothing drawn yet", and flashes.
  5. B draws for a minute: B's tile updates within ~10 s of each change; no other tile moves or flickers; B's last-changed time keeps updating.
  6. B and C draw at the same time: both tiles update.
  7. B submits: B's tile changes to Submitted and flashes.
  8. A second Teacher saves a Review for B: B's tile shows Marked in A's Gallery.
  9. A clicks C's tile (still being drawn): the Review screen opens watch-only. A closes it: back in the Gallery, which catches up immediately.
  10. A clicks B's tile (Submitted): the Review screen opens ready for marking.
  11. Another Teacher deletes a Project: its tile disappears.
  12. A goes Back: Student Maps for the same Task. Network panel shows the Gallery checks stopped.
  13. A hides the tab for 30 s while B draws, then returns: Gallery catches up at once.
  14. A goes offline for 30 s, then back: last maps stay, no error, next check succeeds.
  15. Nothing changes for 1 minute: no flicker, no highlights.

## Out of Scope

- Showing the Gallery on a projector to students, full-screen mode, or hiding names.
- A Gallery across several Tasks or for a whole Class.
- Zooming or panning inside a tile.
- Showing the Legend, Reference Map or Review ink on tiles.
- Marking, deleting or handing in from the Gallery.
- Filtering, searching or re-sorting tiles.
- Supabase Realtime for instant, stroke-by-stroke updates (would be a Supabase change; propose separately if ~10 s feels too slow).

## Further Notes

- Glossary: **Gallery** added to GLOSSARY.md. The button is labelled "Gallery", not "Review all", because a Review is the saved feedback on one Project.
- Delivery: `amos-branch` → pull request → Kiddy merges → Netlify deploys `main`.
