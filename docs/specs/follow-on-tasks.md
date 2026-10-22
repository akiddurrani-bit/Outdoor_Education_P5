# Spec: Follow-on Tasks and Hazards

Status: draft · Supabase (proposed, not applied) + front end · Tracked in [issue #22](https://github.com/akiddurrani-bit/Outdoor_Education_P5/issues/22)
Builds on `handed-in-is-final.md`: a Submitted or Marked Project stays final. A Follow-on Task gives students a fresh copy to keep working on instead of reopening it.

## Problem Statement

Task 1 is working: students draw their school map, hand it in, the Teacher marks it, and the students read the feedback. The lesson then moves on to Task 2, where students come back to their map, refine it using the feedback, and identify potential safety hazards around the school.

Today that is impossible. A Marked Project is final, and a Project belongs to one Task, so after the first feedback students have nothing to keep working on. Simply reopening the Marked map would bring back the problem that made hand-ins final: the Teacher's red ink stops pointing at the right things once the map changes underneath it. There is also no way to show a safety hazard on the map.

## Solution

A Teacher can create a **Follow-on Task** from an earlier Task with one button. Each Group's Project for the Follow-on Task starts as a **copy** of the map that Group made for the earlier Task. The earlier Project and its Review stay exactly as they were. The new Project is drawn, handed in and marked on its own.

- Groups carry over unchanged. A student who had no Project in the earlier Task (absent, or new to the Class) can be added to an existing Group.
- Students can edit everything on the copied map and add **Hazards**: bright red ⚠ symbols placed at one spot, each with a name and an optional note on why it is dangerous. Hazards have their own section in the Legend.
- While working on the Follow-on Task, students can open their earlier map and its feedback in a separate, view-only view. The red ink never sits on the map they are changing.
- When marking, the Teacher can show the earlier map next to the new one to see what improved.
- The two Tasks are linked for students: "Continue in Task 2 →" on the Marked earlier map, and "Follows on from…" on the new Project's card.

The Hazard tool is an ordinary per-Task tool. A Teacher who wants mapping and hazards in one session can create a single Task with the Hazard tool on; a Follow-on Task is only needed when there is feedback in between.

## User Stories

### Teacher: creating a Follow-on Task

1. As a Teacher, I want a "Create follow-on Task" button on an existing Task, so that I can set up the next stage without starting from scratch.
2. As a Teacher, I want a plain-words confirmation screen before the Follow-on Task is created, so that I understand what will happen to my students' maps.
3. As a Teacher, I want the confirmation screen to tell me that each student or Group starts with a copy of their map and that the earlier Task and my feedback stay unchanged, so that I am not afraid of losing work.
4. As a Teacher, I want the confirmation screen to tell me that Groups stay the same and that absent students can be added to a Group, so that I can plan the lesson.
5. As a Teacher, I want the confirmation screen to tell me students get a new Task Code and can also continue straight from their earlier map, so that I know what to tell the class.
6. As a Teacher, I want to be able to cancel on the confirmation screen, so that nothing is created by accident.
7. As a Teacher, I want the Follow-on Task to be set for the same Classes as the earlier Task, so that I don't have to choose them again.
8. As a Teacher, I want the Follow-on Task to use the same Reference Map as the earlier Task, so that students compare against the same site.
9. As a Teacher, I want the Follow-on Task to allow the same tools as the earlier Task, plus the Hazard tool, so that the settings are right without fiddling.
10. As a Teacher, I want to edit the title and instructions of the Follow-on Task before sharing it, so that I can explain the hazard activity.
11. As a Teacher, I want to change the tools and Classes of the Follow-on Task like any other Task, so that I keep control.
12. As a Teacher, I want the Follow-on Task to get its own Task Code, so that it behaves like any other Task.
13. As a Teacher, I want the Follow-on Task to appear directly under the earlier Task in my Task list, slightly indented, so that I see them as a sequence.
14. As a Teacher, I want to create a Follow-on Task from a Follow-on Task (Task 3 from Task 2), so that the lesson can carry on later if we decide to.
15. As a Teacher, I want the link between the two Tasks to stay fixed once students have started, so that nobody's starting map changes under them.
16. As a Teacher sharing a Class, I want any Teacher of the Class to be able to create a Follow-on Task, so that all Teachers stay equal.

### Teacher: switching Hazards on for any Task

17. As a Teacher, I want a Hazard tool switch among the Task's tools, so that I decide when students can mark hazards.
18. As a Teacher, I want to be able to switch the Hazard tool on for an ordinary Task, so that I can run mapping and hazards in one session.
19. As a Teacher, I want the Hazard tool off by default on new ordinary Tasks, so that existing lessons are not changed.

### Student: starting the Follow-on Task

20. As a student, I want to type the new Task Code and land straight in my Group's map, so that I don't have to choose my Group again.
21. As a student, I want my Follow-on Task map to start as a copy of my Group's earlier map, so that I can carry on where we left off.
22. As a student, I want a "Continue in Task 2 →" button on my Marked earlier map, so that I can move on without typing a code.
23. As a student whose earlier map is only handed in but not yet Marked, I want the same "Continue" button, so that I am not held up by marking.
24. As a student whose earlier map was never handed in, I want a warning that starting the Follow-on Task will hand in my earlier map, so that I am not surprised.
25. As a student, I want to be able to cancel at that warning, so that I can still hand in the earlier map myself.
26. As a student, I want the earlier map handed in automatically when I start the Follow-on Task, so that my Group never ends up with two live maps that drift apart.
27. As a student, I want my Follow-on Task map to be the copy taken when it was first created, so that later changes elsewhere don't change what I am working on.
28. As a student who had no Project in the earlier Task, I want to start the Follow-on Task with a blank map, so that I can still take part.
29. As a student who had no Project in the earlier Task, I want to choose a Group from other students who also had no earlier Project, so that I don't have to work alone.
30. As a Guest who continues as the same Guest on the same device, I want my earlier map copied, so that I can carry on.
31. As a Guest on a different device, I want to be able to start the Follow-on Task with a blank map, so that I can still take part.

### Student: Groups in the Follow-on Task

32. As a Group member, I want our Group to be exactly the same as in the earlier Task, so that we keep working together.
33. As a Group member, I want an "Add a groupmate" option in the Follow-on Task, so that a classmate who missed the earlier Task can join us.
34. As a Group member, I want "Add a groupmate" to offer only students who had no Project in the earlier Task, so that nobody's own map is lost or merged.
35. As a student who is added to a Group, I want to see the Group's map straight away, so that I can catch up.
36. As a student who is added to a Group, I want to be able to ask for a turn to draw like everyone else, so that I am a full member.
37. As a Group member, I want it to be impossible for anyone to be removed from our Group, so that nobody is pushed out.
38. As a Group with a member absent on the day, I want the rest of us to carry on with the shared map, so that one absence doesn't stop the Group.
39. As a student working alone in the earlier Task, I want to stay a Group of one in the Follow-on Task, unless a classmate with no earlier Project is added, so that my work stays mine.

### Student: refining the map and marking Hazards

40. As a student, I want to move, change, add and delete Landmarks and Routes on the copied map, so that I can act on my Teacher's feedback.
41. As a student, I want a Hazard tool, so that I can mark a potential safety danger on the map.
42. As a student, I want each Hazard to show as a bright red ⚠ symbol, so that hazards stand out from everything else.
43. As a student, I want to give each Hazard a short name such as "Wet floor near canteen", so that others know what it is.
44. As a student, I want to add an optional note on why a Hazard is dangerous, so that I can explain my thinking.
45. As a student, I want to move and delete Hazards, so that I can correct mistakes.
46. As a student, I want Hazards listed in their own section of the Legend, so that the hazards are easy to find.
47. As a student, I want Hazards to keep the same size as I zoom, so that they stay readable.
48. As a Group, we want Hazards to follow the same drawing turns (Editor, Edit Requests) as everything else, so that we never clash.

### Student: seeing earlier feedback

49. As a student, I want a "Task 1 feedback" button while working on the Follow-on Task, so that I can check what my Teacher said.
50. As a student, I want that button to show the earlier map exactly as it was marked, with the Teacher's comment and red ink, so that the feedback makes sense.
51. As a student, I want the earlier map to be view-only, so that I can't change it by accident.
52. As a student, I want no red ink on the map I am working on until the Teacher marks the Follow-on Task, so that old feedback never points at the wrong things.
53. As a student whose earlier map was not Marked, I want the feedback button to say there is no feedback yet, so that I am not confused.

### Student: My Projects and finality

54. As a student, I want the Follow-on Task to show as its own card on My Projects with "Follows on from: <earlier Task>", so that I can see how they connect.
55. As a student, I want the earlier Task's card to stay as it was (Handed in or Marked), so that I can still read that feedback.
56. As a student, I want to hand in the Follow-on Task the same way as any Task, with the same warning, so that nothing new needs learning.
57. As a student, I want the Follow-on Task map to be final once handed in, just like any Task, so that the rules stay the same.

### Teacher: watching and marking the Follow-on Task

58. As a Teacher, I want the Follow-on Task's Gallery and Student Maps list to work exactly as for any Task, so that I can follow the lesson.
59. As a Teacher, I want to see Hazards on students' maps in the Gallery and the Review screen, so that I can judge them.
60. As a Teacher, I want a "Show Task 1 map" button when marking a Follow-on Task Project, so that I can see what improved.
61. As a Teacher, I want the earlier map shown with its Review, so that I can check whether students acted on my feedback.
62. As a Teacher, I want the Follow-on Task Review to be separate from the earlier Review, so that each map keeps its own feedback.
63. As a Teacher, I want "Hand in for them" to work on Follow-on Task Projects, so that Groups who forget can still be marked.
64. As a Teacher, I want to see which Groups gained a member in the Follow-on Task, so that I know who joined late.

### Safety of existing work

65. As the group running the app, I want earlier Projects and Reviews never changed by creating or starting a Follow-on Task (except the automatic hand-in of a draft), so that no work is lost.
66. As the group, I want existing Tasks to behave exactly as now, so that the live demo is not put at risk.
67. As the group, I want the database changes proposed with exact SQL, a read-only check and an undo, reviewed and run by a person, so that we stay in control.

## Implementation Decisions

- **Task link.** A Task gains an optional "follows on from" reference to one earlier Task. It is set only through "Create follow-on Task", and cannot be changed once any Project exists for the Follow-on Task. Chains (Task 3 from Task 2) need nothing special.
- **Create follow-on Task (Teacher, front end).** It creates a new Task with the link, copying the earlier Task's Classes, Reference Map and allowed tools, with the Hazard tool switched on. It also gets a new Task Code, a suggested title ("<earlier title> — part 2") and empty instructions for the Teacher to fill in. It is only allowed for a Teacher of the earlier Task's Classes, under the existing Teacher-scoping rules (ADR 0001). A confirmation screen with the wording agreed in the grilling session comes first.
- **Starting a Follow-on Project (database).** The student project-loading functions, for Roster students and Guests, handle Follow-on Tasks. When a student with no Project yet for the Follow-on Task opens it:
  1. Find the student's Project for the earlier Task.
  2. If it exists: hand it in if it is still a draft (only after the student confirmed on the front end), create the new Project as a copy of its map, record which Project it was copied from, and give it the same Group members.
  3. If none exists: create a blank Project, with the usual Group choice limited to students with no earlier Project.
  The copy happens once. Starting is idempotent: a second member opening the Task joins the Group's existing Follow-on Project rather than creating another.
- **Copy, never share.** The new Project has its own map data and its own Review. Nothing the students or Teacher do to it reaches the earlier Project, and the reverse holds too.
- **Add a groupmate (database).** A new student-callable function lets a member of a Follow-on Project add a student from one of the Task's Classes who has no Project for the earlier Task and none yet for this Task. Removing members is not possible.
- **Guests.** A Guest's earlier Project is found only through their existing Guest identity (same device, "Continue Guest"). Otherwise they start blank. No new Guest recovery.
- **Hazard feature (front end).** A new map feature type next to Landmarks and Routes. It is a single point with a name and an optional note, and is drawn as a bright red ⚠ symbol at a fixed on-screen size. It is stored in the Project's map data like other features, and older Projects simply have none. It gets its own Legend section, and the Gallery tiles, the Review screen and downloads show it too. It is controlled by a new "hazard" entry in the allowed tools, off by default for ordinary Tasks.
- **Earlier feedback view (front end).** A view-only overlay or panel that shows the earlier Project's map with its Review (comment and red ink), using the existing Review display. It is opened from "Task 1 feedback" on the student side and "Show Task 1 map" on the Teacher Review screen.
- **Linking on screens.** The earlier Project's Handed in and Marked banners show "Continue in <Follow-on Task title> →" when a Follow-on Task exists for one of the student's Classes. My Projects cards show "Follows on from: <title>". The Teacher Task list shows Follow-on Tasks indented under the Task they follow.
- **Rules unchanged.** Existing finality rules stay as they are, both the database triggers (no student change once Submitted or Reviewed; Reviews only on Submitted Projects) and Editor and Edit Request turn-taking. The automatic hand-in uses the same hand-in route as a student pressing Hand in.
- **Rollout.** The database step goes first, with a read-only check and an undo, proposed for Kiddy to review and run by hand. Then the page is published. Until a Follow-on Task is created, nothing changes for anyone.

## Testing Decisions

- A good test drives the feature the way people would (a Teacher creating Task 2; Amir, Bea and Cai opening it on different devices; Fay joining late) and checks only what each person can see or do, not internal details.
- **Database rehearsal on PGlite** (main seam), with Teacher scoping, handed-in-is-final and Edit Requests applied. It covers:
  - the copy matches the earlier map, and the earlier Project and Review are unchanged afterwards
  - an earlier draft is handed in on start
  - a second Group member joins the same Follow-on Project, with no duplicate
  - the Group is carried over
  - a student with no earlier Project starts blank
  - "Add a groupmate" allows only students with no earlier Project, and refuses outsiders, students with an earlier Project, and non-members calling it
  - nobody can be removed
  - a Guest with and without their identity
  - the link can't be changed after start
  - a chained Task 3
  - an ordinary Task behaves exactly as before
  - the undo
  Prior art: the rehearsals in `handed-in-is-final.md` and `edit-requests.md`.
- **Simulated-browser test** (screens). It covers:
  - the Create follow-on Task confirmation and the pre-filled settings
  - the Task list indent
  - the Continue button and the draft hand-in warning
  - the copied map
  - placing, naming, moving and deleting Hazards, and the Legend section
  - the Task 1 feedback view with no red ink on the live map
  - Add a groupmate
  - the "Follows on from" card
  - Show Task 1 map on Review
  All earlier screen tests must still pass. Prior art: the simulated-browser test in `handed-in-is-final.md`.
- **Real-device checklist** (TEST Class, two or three iPads or browsers):
  1. Mark a TEST Task 1 map.
  2. Create the follow-on Task.
  3. Both Group members continue into Task 2 and see the same copied map.
  4. Add Hazards and refine the map.
  5. Open Task 1 feedback.
  6. A late student is added.
  7. Hand in and mark Task 2 with Show Task 1 map.
  8. Task 1 is still unchanged.
- **Where to test.** Only in a TEST Class with TEST Tasks.

## Out of Scope

- Reopening or returning a Marked or Submitted Project (still final).
- Changing Groups in a Follow-on Task beyond adding students who had no earlier Project. That includes removing members, swapping Groups, and merging two Groups' maps.
- Letting Guests recover their identity on another device (name + Guest Code, or moving a Guest onto a Roster).
- A "combined" Task type: one ordinary Task with the Hazard tool on already covers that.
- Hazards as areas or routes. Hazard categories or severity levels.
- Any special plan for Task 3 beyond the chaining that already works.
- Showing the Gallery for two Tasks at once.

## Further Notes

- Decided in a grilling session on 22 Oct 2026. GLOSSARY.md was updated: Follow-on Task and Hazard added; Group and Legend updated.
- Follows the agreed rule: Supabase changes are proposed with exact SQL and an undo, then reviewed, agreed with Kiddy and run by a person, never applied automatically. The exact SQL will be added to this spec once the functions are drafted.
- Answers the question "once the teacher gives the first feedback, can students continue working on the map?" Yes, through a Follow-on Task, without reopening the marked map.
