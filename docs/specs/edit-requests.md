# Spec: Edit Requests — taking turns to draw in a Group

Status: draft · Phase 4 · Supabase (proposed, not applied) + front end

## Problem Statement

Every student has their own iPad. When a Group opens its Project, only the first iPad can draw (the Editor); everyone else is View-only. Today the others are stuck: their screen shows the map as it was when they opened it, they cannot see it grow, and the only way to get a turn is for the Editor to leave and then wait up to 90 seconds for the lock to run out. There is no way to ask for a turn, and an Editor who has wandered off or is not paying attention blocks the whole Group.

## Solution

View-only Group members watch the map grow live, and can tap **Ask to draw**. The Editor gets a prompt — "Bea wants to draw. Handing over in 30 s" — with **Hand over** and **Not now**. Handing over saves the Editor's work and gives the pen straight to the student who asked. If the Editor does not answer within 30 seconds, the pen passes to the asker anyway, but only if the asker is still there with the app on screen; otherwise the request runs out. Only one Edit Request waits at a time. Live co-editing (two people drawing at once) is deliberately not offered.

## User Stories

1. As a View-only Group member, I want to see the Editor's map update on my iPad as they draw, so that I can follow and discuss the work.
2. As a View-only Group member, I want my iPad to keep my own zoom and position while the map updates, so that I am not thrown around the screen.
3. As a View-only Group member, I want an **Ask to draw** button, so that I can get a turn without shouting across the field.
4. As a View-only Group member who has asked, I want to see "Waiting for Amir…", so that I know my request was sent.
5. As a View-only Group member who has asked, I want a **Cancel request** button, so that I can change my mind.
6. As a View-only Group member, I want to be told "Someone already asked. Wait for Amir to answer." when another member's request is waiting, so that I understand why I cannot ask now.
7. As an Editor, I want a clear prompt naming who wants to draw, so that I know who I would hand over to.
8. As an Editor, I want the prompt to show a countdown, so that I know how long I have to decide.
9. As an Editor, I want **Hand over**, so that I can give my classmate a turn at once.
10. As an Editor, I want **Not now**, so that I can finish what I am drawing.
11. As an Editor, I want my work saved before the pen leaves my iPad, so that nothing I drew is lost.
12. As an Editor whose turn has passed to someone else, I want to see "Bea is drawing now. Ask to draw to get a turn back.", so that I know what happened and what to do.
13. As an asker who was refused, I want to see "Amir said not now", so that I know to wait and ask again later.
14. As an asker whose request was granted, I want my iPad to switch to drawing straight away with the latest map, so that I can carry on from where the Editor stopped.
15. As an asker, I want the pen to come to me if the Editor does not answer within 30 seconds, so that an inattentive Editor cannot block the Group.
16. As an Editor who is busy drawing, I want to still have the full 30 seconds to say Not now, so that I am not interrupted without warning.
17. As a Group, we want the pen to pass automatically only to someone who is actually there with the app on screen, so that it never goes to an iPad that is asleep, closed or in a bag.
18. As an asker who left the app or let the iPad sleep while waiting, I want to see "Your request ran out. Ask again." when I come back, so that I know to ask again.
19. As an Editor, I want an asker's request to disappear from my screen if they leave, so that I am not asked by someone who is gone.
20. As an Editor who taps Hand over just as the asker disappears, I want to simply stay the Editor, so that the pen is never lost.
21. As an asker whose request is waiting when the Editor leaves the Project, I want the pen to come to me straight away, so that I do not wait 90 seconds.
22. As a Group, we want today's rule kept — an Editor's iPad that goes quiet frees the pen within about 90 seconds — so that a dead iPad never blocks us.
23. As a student, I want requests and answers to arrive within about 5 seconds, so that taking turns feels responsive.
24. As a student working alone, or a Guest, I want no Ask to draw button, so that my screen stays simple.
25. As a Teacher, I want Edit Requests to need nothing from me, so that I can sort out disputes in person rather than through the app.
26. As a Teacher reviewing a Project, I want my Reviews to keep working exactly as today, so that Edit Requests do not affect marking.
27. As the group running the demo, I want the rollout to keep the live app working at every step, with an undo, so that a lesson is never broken.

## Implementation Decisions

- **Rules live in the database.** Every rule — one waiting request per Project, the 30-second countdown, "is the asker there", handing the lock to the asker — is decided by new student functions in Supabase, in one place, so two iPads can never disagree. The front end only asks and displays.
- **Waiting request.** A new record per Project holds at most one Edit Request: who asked (student, name, and which device), when, the countdown deadline (asked + 30 s), when the asker's device was last seen, and its outcome (waiting, refused, cancelled, ran out, granted). Only Group members of that Project can create or see it, via the same access check the edit lock already uses.
- **New student functions** (all security definer, like today's lock functions):
  - *ask to draw* — refused if the caller is the Editor, if another request is waiting, or if the Project has fewer than two Group members.
  - *check request* — called by both sides about every 5 seconds. For the asker it also records "I'm here" and returns the outcome; for the Editor it returns any waiting request and seconds left.
  - *answer request* (Hand over / Not now) — Editor only.
  - *cancel request* — asker only.
- **"There and looking"** means the asker's device has checked in within the last ~10 seconds. The asker's device only checks in while the app is on screen (the existing live-check helper already pauses when the page is hidden), so a hidden or sleeping iPad stops counting as present.
- **Hand-over moves the lock directly.** Granting rewrites the existing edit-lock row to the asker's device with a fresh 90-second lease, in the same step that marks the request granted — so no third iPad can grab the pen in between. If the asker is no longer there at that moment, nothing changes and the Editor stays Editor.
- **Countdown with no server timer.** Nothing runs on the server by itself. When the countdown has passed, whichever side checks next settles it: hand over if the asker is present, otherwise "ran out". To protect the Editor's last strokes, the Editor's iPad saves at 0, and the hand-over only completes a few seconds after 0 so that save lands first. (The map already autosaves about a second after each change.)
- **Editor leaves with a request waiting.** Releasing the lock hands it to the waiting asker if present, instead of freeing it for anyone.
- **Old Editor's iPad.** Its next save is refused by the existing lock check; it switches to View-only with "Bea is drawing now…" (today's "editing has moved to another device" path, with the new wording).
- **Live following.** A View-only iPad reloads the saved map about every 10 seconds when it has changed, using the existing live-check helper, keeping the viewer's zoom and position.
- **Checking cadence.** The Editor's iPad checks for requests every ~5 s while it holds the lock on a Group Project; the asker's iPad every ~5 s while waiting. This is extra light traffic on top of the existing 25-second lock heartbeat.
- **Rollout, each step safe:** (1) database, additive — new record and functions, existing lock functions extended so release hands over to a waiting asker; today's page unaffected. (2) Front end. Each database step has a read-only check and an undo. SQL is proposed for the group to review and run, not applied directly.

## Testing Decisions

- A good test drives the feature the way students would — Amir, Bea and Cai on separate devices asking, answering and leaving — and checks only what each of them would see or be able to do, not internal details.
- **Database rehearsal** (main seam): the new functions are run on a local Postgres with Supabase stand-ins, pretending to be three Group members' devices plus an outsider. Time is moved by back-dating records. Covers: ask/answer/cancel, one request at a time, Not now, countdown hand-over with asker present, ran out when asker absent, hand-over refused when asker vanished, Editor leaving hands to the asker, outsider and solo Projects refused, lock lease still expiring after 90 s, the old Editor's save refused afterwards, and the undo restoring today's behaviour. Prior art: the Phase 3 sign-in and Teacher-scoping rehearsals.
- **Real-device checklist** (TEST Class, a Group of three, two or three iPads or browsers): live following; ask → Hand over; ask → Not now; ask → ignore 30 s with asker watching (pen moves); ask → ignore 30 s with asker's iPad asleep (ran out); second asker blocked; Editor leaves while a request waits; Teacher Review still appears live.

## Out of Scope

- Live co-editing (two people drawing at the same time).
- Supabase Realtime / instant updates; ~5 s is accepted.
- A Teacher override button.
- The Editor handing over without being asked.
- A queue of several requests.
- Solo Projects and Guests.

## Further Notes

- Decided in a grilling session on 19 Oct 2026; vocabulary follows GLOSSARY.md (Editor, View-only, Edit Request, Group, Project).
- An ADR recording "one Editor with Edit Requests instead of live co-editing" was offered; not yet written.
- Built 20 Oct 2026: database rehearsal 71/71, simulated screens 35/35. The database step must run before the new page goes live.
