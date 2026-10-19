# Spec: Handed in is final

Status: built, not yet live · Phase 5 · Supabase (proposed, not applied) + front end
Supersedes `resubmitted-awaiting-review.md` (#7): there is no handing in again, so Resubmitted no longer exists.

## Problem Statement

In a test run, a Teacher reviewed a Group's map while the students were still drawing it. The red ink ("good", "not good", arrows) appeared on the students' screens mid-drawing, and as soon as they moved or added shapes it no longer pointed at the right things. At the same time, Kevin was signed in on two devices and was locked out of his own map because "Kevin" was drawing elsewhere.

## Solution

A Project is marked only once it is handed in, and handing in is final:

- While a Group draws, the Teacher can watch the map update but cannot use the Red Pen or save feedback. A "Hand in for them" button covers Groups that forget.
- A Group hands in once, after a warning. From then on the map is locked on every member's device ("Handed in — waiting for your teacher").
- When the Teacher saves the Review, students see it on the locked map ("Your teacher has marked this map"). It is final.
- A student is signed in on one device at a time. Signing in elsewhere signs the first device out and frees the pen straight away.

## User Stories

1. As a student, I want no red ink to appear while my Group is still drawing, so that I can concentrate on the map.
2. As a student, I want a warning before handing in, so that I don't hand in by accident.
3. As a student, I want the map to lock on every Group member's device once it is handed in, so that nobody changes it after the Teacher starts marking.
4. As a student, I want to see "Handed in — waiting for your teacher" on a handed-in map, so that I know why I can't draw.
5. As a student, I want to see my Teacher's red ink and comment on the exact map they marked, so that the feedback makes sense.
6. As a student, I want a marked map to say "Your teacher has marked this map", so that I know the work is finished.
7. As a student who signs in on a new device, I want my old device signed out, so that I am never locked out by myself.
8. As a student on the old device, I want to be told "You signed in on another device", so that I understand what happened.
9. As a Group, we want the pen freed immediately when its holder signs in elsewhere, so that we don't wait 90 seconds.
10. As a Teacher, I want to watch a Group's map update while they draw, so that I can follow progress during the lesson.
11. As a Teacher, I want the Red Pen and Save switched off on drafts, with a note saying why, so that I can't mark half-finished work by mistake.
12. As a Teacher, I want a "Hand in for them" button, so that I can mark a Group that forgot to hand in.
13. As a Teacher, I want "Hand in for them" to ask first, so that I don't lock a Group out mid-lesson by accident.
14. As a Teacher, I want marking to switch on as soon as a map is handed in, so that I can start straight away.
15. As a Teacher, I want the "Resubmitted" label gone, so that the list only shows states that can happen.
16. As the group running the demo, I want existing reviewed drafts to count as Marked, so that one rule applies to everything.

## Implementation Decisions

- **One rule on the Projects table** (a database trigger): a signed-in student cannot change a Project that is Submitted or has a Review. Teachers, and the SQL Editor, can. This covers every route, including the save functions and direct table access, so the student save functions themselves are unchanged.
- **One rule on Reviews** (a trigger): a Review can only be saved for a Submitted Project.
- **Existing data:** Projects reviewed while still drafts become Submitted, so "Marked" always implies "handed in".
- **One device per student:** choosing your name removes that student's other device session and any pen it held. The old device notices within about 10 seconds (it checks who it is signed in as) and returns to the sign-in screen with a message.
- **"Hand in for them"** is a plain Teacher update of the Project's status (already allowed by the Teacher access rules).
- **Front end:** a handed-in or marked Project is never claimed for drawing; the banner shows Handed in or Marked; turn-taking stops. Group members' devices notice a hand-in within about 10 seconds. A save refused because of a hand-in switches straight to the locked view. On the Teacher side, drafts refresh about every 10 seconds, and marking controls are disabled until handed in.
- **Rollout:** run the database step first (`50`, with a read-only check and undo `59`), then publish the page. The old page keeps working, except that students can no longer save a handed-in map.

## Testing Decisions

- Database rehearsal on PGlite with item 8 and Edit Requests applied (30 checks): drafts editable; hand-in final, including for a Guest and for direct table access; Teacher cannot review drafts but can watch them; Hand in for them; reviewed drafts converted; one device per student including the pen; check and undo.
- Simulated-browser test (27 checks): hand-in warning and lock, marked view, a groupmate handing in, the Teacher handing in mid-drawing, signed out elsewhere, Teacher draft lock and Hand in for them, no Resubmitted label. All earlier screen tests still pass.
- Real-device checklist (TEST Class, two iPads or browsers): hand in → both lock; Teacher marks → both see it; draft → Teacher can't mark → Hand in for them; Kevin signs in on a second device → first device signed out.

## Out of Scope

- Taking back a hand-in (decided against: submitting is final).
- Improving and handing in again after marking.
- Teacher returning work for changes.

## Further Notes

- Decided in a grilling session on 20 Oct 2026; GLOSSARY.md updated (Submitted, Review, Marked, Editor; Resubmitted removed).
