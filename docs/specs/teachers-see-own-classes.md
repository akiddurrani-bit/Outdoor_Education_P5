# Spec: Each Teacher sees only the Classes they teach

Status: draft · Phase 3, item 8 · Mostly Supabase (to be proposed, not applied) · Decision: [ADR 0001](../adr/0001-open-teacher-signup-scoped-to-classes.md)

## Problem Statement

The app is meant to be picked up by other teachers: anyone with an email can sign up as a Teacher and create their own Classes. Today, though, every Teacher sees and can change everything — every Class, every Roster of names, every Task, every Project and Review, and can delete any of it. That was convenient for five of us sharing TG1 in the demo, but it means a new teacher from another school would see our students, and we would see theirs. Before the app is used with real Primary 1–6 children, a Teacher must only ever see the Classes they teach.

## Solution

Each Class has its Teachers. Whoever creates a Class becomes its first Teacher automatically. A Teacher sees and manages only their Classes, and through them only those Classes' Rosters, Tasks, Projects, Reviews and Reference Maps. A newly signed-up Teacher starts with an empty dashboard and builds their own Classes. The five of us are linked to TG1 once, so the demo carries on exactly as before. Students notice no difference.

## User Stories

1. As a new Teacher, I want to sign up with my email and start with an empty dashboard, so that I never see another school's students.
2. As a new Teacher, I want to create a Class and automatically become its Teacher, so that I can start adding my Roster straight away.
3. As a Teacher, I want to see only the Classes I teach in the Classes tab, so that my list is relevant and private.
4. As a Teacher, I want to see, add, rename and remove students only in my Classes' Rosters, so that I cannot change another Teacher's Roster.
5. As a Teacher, I want the Tasks tab to show only Tasks I created or that are set for one of my Classes, so that I see only my lessons.
6. As a Teacher, I want "Assigned classes" on a Task to offer only my Classes, so that I cannot set work for someone else's Class.
7. As a Teacher, I want Student Maps to show only Projects for Tasks I can see, so that other schools' work stays private.
8. As a Teacher, I want to review, mark and delete only those Projects, so that I cannot change another Teacher's students' work.
9. As a Teacher, I want Guest Projects for my Tasks to appear in my Student Maps, so that Guests in my lesson are not lost.
10. As a Teacher, I want to upload, replace and remove Reference Maps only for my Tasks, so that nobody else can swap the image my students compare against.
11. As one of the five demo Teachers, I want all of us to keep seeing and marking TG1 as we do now, so that the demo is unaffected.
12. As a Teacher sharing a Class with others, I want all of us to have the same rights over it, so that no one is stuck waiting for an "owner".
13. As a Teacher, I want a Task I set for my Class and a colleague's Class to be visible to both of us, so that we can both mark it.
14. As a Teacher, I want deleting a Task to remain possible only for Tasks I can see, so that I cannot delete another school's work.
15. As a student, I want signing in, opening Tasks, drawing, saving, submitting and seeing feedback to work exactly as before, so that nothing changes for me.
16. As a Guest, I want my Project and its Review to work as before, so that nothing changes for me.
17. As the group, I want the change rehearsed somewhere other than the live database first, so that a mistake cannot lock everyone out during the demo.
18. As the group, I want an exact undo, so that we can return to the current rules within minutes if something goes wrong.
19. As the group, I want to check the result with a brand-new test Teacher account, so that we can see with our own eyes that it sees nothing it should not.

## Implementation Decisions

- **New concept in the database: a Class's Teachers.** A link between Classes and Teacher accounts. Filled in once from today's data (each Class's creator becomes its Teacher) plus the one-off link of the five demo accounts to TG1. New Classes link their creator automatically when created.
- **One question decides access: "Is this person a Teacher of this Class?"** A small database helper answers it. Every Teacher-facing access rule is rewritten in terms of it:
  - *Classes, Rosters:* only for Classes you teach. Creating a Class is open to any Teacher.
  - *Tasks:* visible if you created it or it is set for a Class you teach. Same for changing and deleting it.
  - *Task assignments:* you can only set a Task for Classes you teach.
  - *Projects, group membership, Reviews:* visible and changeable if you can see the Project's Task. This covers Guest Projects, which have no Class.
  - *Reference Map files:* stored per Task already, so access follows the Task.
- **Students are untouched.** Everything students do goes through the existing student and Guest database functions, which run with their own rights and are not changed.
- **Front end: two small changes, which must be live before the database change.** The Teacher dashboard already reads and writes through the database's access rules, so it will simply see less. But two flows relied on "everyone sees everything" (found in rehearsal):
  - *Saving a Task's Classes* used to delete all of them and re-add the ticked ones. A co-Teacher only sees a Task through its Classes, so for a moment they would lose it and the re-add would be refused — the Task would drop out of TG1. It now adds ticked Classes first, then removes unticked ones.
  - *Deleting a Task* removed the Class links and the Reference Map around the Task delete; under the new rules the Task delete would silently do nothing and the image would be left behind. It now removes the Reference Map first, deletes the Task (which removes its Class links automatically), and reports if nothing was deleted.
  Both behave the same as before under today's rules, so they can ship first.
- **Duplicate access rules are removed in the same change.** Some tables currently have a strict rule and a loose rule side by side, and the loose one wins; all of them are replaced by the new set, so no stale rule is left behind.
- **Delivered as one reviewed SQL script** with: the new link and helper, the backfill, the TG1 link, the rule replacements, a read-only verification, and an undo script that restores today's rules from the schema snapshot. The script is drafted next, as its own step, and nothing is run until reviewed and agreed with Kiddy.
- **No in-app "add a Teacher to a Class" yet** (deliberately deferred). Linking a second Teacher is done by hand in the database for now.

## Testing Decisions

- **Rehearse first, on a separate free Supabase project** set up with today's schema (from the snapshot), never the live one. Run the script there, test, then run it on live.
- **Already rehearsed on a local Postgres (PGlite) with Supabase stand-ins:** setup → pre-check → change → verify → behaviour checks (new Teacher isolation, demo Teachers unaffected, co-Teacher Task saving/deleting, Reference Maps, students and Guests unaffected) → undo restores the original 24 rules exactly. 47/47 passed. The Supabase rehearsal project still covers what PGlite cannot: the real storage service and dashboard permissions.
- **One seam, at the top: the real app with different accounts.** Checks look only at what each person sees.
- **Checklist** (on the rehearsal project, then again on live in a quiet moment):
  1. A brand-new Teacher account signs up: Classes and Tasks are empty; Student Maps empty.
  2. The new Teacher creates a Class: it appears immediately; they can add students.
  3. The new Teacher creates a Task: "Assigned classes" shows only their Class.
  4. Each of the five demo accounts still sees TG1, its Roster, its Tasks and Projects, and can mark.
  5. The new Teacher cannot see TG1 anywhere, and TG1 Teachers cannot see the new Class.
  6. A Guest Project on a TG1 Task appears for TG1 Teachers only.
  7. Reference Map: a TG1 Teacher can replace TG1's Task image; the new Teacher cannot see it.
  8. A student in TG1: sign in, open Task, draw, save, submit, see a Review — all as before. A Guest: same.
  9. Run the undo on the rehearsal project: everything is visible to every Teacher again.

## Out of Scope

- An in-app way to add or remove a Teacher from a Class.
- Approving or blocking Teacher sign-ups; Teacher display names.
- Class Open/Closed (item 9), Task-Code-first sign-in (item 10), first-name-only Rosters (item 11).
- Any change to how students or Guests sign in.

## Further Notes

- Most important item before real P1–6 children use the app.
- The repo is public: discuss timing and the live rollout privately with Kiddy rather than in public issues.
- Vocabulary follows GLOSSARY.md (Teacher, Class, Roster, Task, Project, Review, Guest, Reference Map).
