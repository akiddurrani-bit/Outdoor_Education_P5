# Spec: Task Code first sign-in

Status: draft · Phase 3, item 10 (item 9, Open/Closed Classes, was dropped on 19 Oct 2026 — see Further Notes) · Supabase (proposed, not applied) + front end

## Problem Statement

A student starts by picking their Class from a dropdown of every Class in the app, then their name. Once other schools use the app, a Primary 3 child would scroll past other schools' Classes and could pick the wrong one, and every Class and name is on show to anyone who opens the sign-in screen. Students already get a Task Code every lesson; the sign-in should start from that.

## Solution

Students sign in with the Task Code first. They type the code their Teacher gave them, then pick their own name from the Rosters of only the Classes that Task is set for, and go straight into the Task (their existing Project, or choosing their Group). They never see a list of Classes. A Class is reachable at sign-in only through a Task set for it, so a Teacher preparing a new Class's Roster has nothing to hide. Guests keep their own route ("Not on the class list?") and also start from the Task Code.

## User Stories

1. As a student, I want to start by typing the Task Code my teacher gave me, so that I do not have to find my Class in a long list.
2. As a student, I want to see only the names from the Class(es) this Task is set for, so that I can find my name quickly.
3. As a student whose Task is set for two Classes, I want names grouped under their Class, so that I pick the right one if two classmates share a first name.
4. As a student, I want my register number shown next to my name, so that I can tell myself apart from a classmate with the same name.
5. As a student, I want to go straight into my Task after choosing my name, so that I start working sooner.
6. As a student who already has a Project for this Task, I want to land in it directly, so that I can continue where I left off.
7. As a student starting a new Task, I want to choose my Group members as today, so that group work still works.
8. As a student, I want a clear message when the code is wrong, so that I know to ask my teacher.
9. As a student, I want "Use a different task code" if I typed the wrong one, so that I can correct it without starting over.
10. As a student, I want "My Projects" to keep showing all my past and current work after signing in, so that nothing is lost.
11. As a student, I want to open a different Task from My Projects by typing its code, as today, so that I do not need to sign in again.
12. As a student using a shared device, I want "Switch Student" to take me back to the Task Code step, so that the next student can sign in.
13. As a Guest, I want "Not on the class list?" to still let me create a Guest account, and the code I already typed to open straight away, so that I can join in quickly.
14. As a Teacher, I want a new Class to be usable at sign-in as soon as I set a Task for it, so that I do not have to remember an extra step.
15. As a Teacher, I want an Archived Class not to be offered at sign-in, so that last year's students do not appear.
16. As a parent or school, I want children's names to be visible only to someone who has the lesson's Task Code, so that names are not on show to any visitor.
17. As the group, I want the rollout to happen in safe steps, so that the live demo keeps working at every stage.

## Implementation Decisions

- **New student lookup: "names for this Task Code".** Given a Task Code, it returns the students (register number, first name, Class) of the non-archived Classes that Task is set for. This replaces "list every Class" + "list a Class's names" at sign-in.
- **Old lookups are retired after the new front end is live:** "list every Class" is closed to browsers; "list a Class's names" (still used for choosing Group members) only answers for a student who is signed in to that Class.
- **Front end — student:** the sign-in dialog has two steps: *Task Code* → *your name* (grouped by Class when the Task has several, shown as "12 · Amir"). Then the existing "open Task from code" flow runs with that code. My Projects, its Task Code box and Switch Student stay. The Guest buttons stay below; a code typed before creating a Guest account opens straight away.
- **Rollout in safe steps** (each keeps the live app working):
  1. *Database, additive:* add the "names for this Task Code" lookup (step 1, then step 11 which removes the Open/Closed setting step 1 originally added). Old lookups untouched.
  2. *Front end:* the new sign-in.
  3. *Database, tightening:* retire the old lookups.
  Each database step has its own read-only check and undo.
- **Order relative to item 8** does not matter.

## Testing Decisions

- **Database steps rehearsed on PGlite** (37/37 checks) and, ideally, on the rehearsal Supabase project, then live.
- **Sign-in screens tested in a simulated browser** with a fake database (17/17 checks).
- **Checklist on the real app** (TEST Class + TEST Task):
  1. Wrong code → clear message; right code → only that Task's Class names, then straight into the Task.
  2. Task set for two Classes → names grouped by Class.
  3. Existing Project → lands in it; new → Group choice → Project.
  4. My Projects lists all work; typing another code there opens it.
  5. Switch Student → back to the Task Code step.
  6. Guest: type code, create account → Task opens.
  7. New Class + Task set for it → its names appear at sign-in straight away; Archive it → names gone.
  8. After step 3: the old "list every Class" lookup is refused; choosing Group members still works.

## Out of Scope

- Student PINs or passwords.
- Changing how Guests are created.
- Teacher-side Class visibility (item 8).

## Further Notes

- **Item 9 (Open/Closed Classes) was dropped:** with the Task Code first, a Class is only reachable through a Task set for it, so an extra Open/Close step mostly added a way for students to be locked out by mistake. Archive remains for retiring a Class; Delete Class removes it with all its data.
- Together with item 8, this must be done before real Primary 1–6 children use the app.
- Vocabulary follows GLOSSARY.md (Task Code, Class, Archived, Roster, Group, Guest, Project).
