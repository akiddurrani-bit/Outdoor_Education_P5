# Spec: Close two unused database functions

Status: draft · Phase 2, items 6–7 · Supabase only (proposed, not applied) · No front-end change · Tracked in [issue #8](https://github.com/akiddurrani-bit/Outdoor_Education_P5/issues/8)

## Problem Statement

Two database functions are still open to every browser even though the current app no longer uses them:

1. **The old save function** that saves a Project without checking who holds the edit lock. The current app saves through the newer locked version, which calls the old one internally. But a browser still running an older copy of the page (for example, a tab left open from before 18 Oct 2026) can call the old one directly and overwrite the Editor's work, defeating the one-device-at-a-time rule.
2. **An old Task lookup by code** that returns any Task's title and instructions for any code, regardless of Class. The current app uses the Class-aware lookup instead.

Neither causes visible problems today, but both are leftovers that weaken rules the app now relies on.

## Solution

Stop browsers from calling these two functions directly, without deleting them. The locked save keeps working, because it calls the old save function from inside the database, which is unaffected. Nothing changes for students or Teachers using the current app.

## User Stories

1. As a student who is the Editor, I want no other device to be able to overwrite my Project through an old page, so that the edit lock really protects my work.
2. As a student on a View-only device, I want saving to stay impossible on my device even if it is running an old copy of the page, so that I cannot accidentally overwrite the Editor.
3. As a Teacher, I want a Task's details to be reachable only through the Class-aware lookup, so that a Task Code alone does not reveal Tasks set for other Classes.
4. As a student using the current app, I want saving, submitting and opening Tasks to work exactly as before, so that nothing breaks.
5. As the group, I want these changes to be easy to undo, so that we can restore them if something unexpected depended on them.
6. As the group, I want to verify the change with a read-only check, so that we know it took effect.

## Implementation Decisions

- **Revoke, don't delete.** Remove the right of browser sign-ins (anonymous students, Guests and Teachers alike) to call the two functions directly. The functions stay in the database; the locked save still calls the old save internally, because database functions run with their owner's rights.
- **No front-end change.** The current app calls neither function directly (confirmed by searching the code).
- **Duplicate access rules are not touched here.** Some tables have both a strict and a loose access rule, where the loose one makes the strict one pointless. Phase 3 rewrites those rules for "each Teacher sees only their Classes", so cleaning them now would be wasted work.

## Proposed SQL (for review — do not run until agreed with Kiddy)

```sql
revoke execute on function public.student_save_project(uuid, uuid, jsonb, boolean)
  from public, anon, authenticated;

revoke execute on function public.get_task_by_code(text)
  from public, anon, authenticated;
```

Check afterwards (read-only — both should return `false`):

```sql
select
  has_function_privilege('authenticated', 'public.student_save_project(uuid, uuid, jsonb, boolean)', 'execute') as old_save_open,
  has_function_privilege('authenticated', 'public.get_task_by_code(text)', 'execute') as old_lookup_open;
```

Undo:

```sql
grant execute on function public.student_save_project(uuid, uuid, jsonb, boolean) to anon, authenticated;
grant execute on function public.get_task_by_code(text) to anon, authenticated;
```

## Testing Decisions

- **One seam, at the top: the real app in two browsers**, plus the read-only check above. Checks look only at what a person sees.
- **Where to test.** TEST Class and TEST Task.
- **Checklist** (after running the SQL):
  1. The read-only check returns `false` for both.
  2. Roster student: open a Project, draw, wait for "Saved"; reload — the drawing is there.
  3. Roster student: submit — status becomes Submitted.
  4. Guest: draw, save, submit — works.
  5. Group: second device is View-only and cannot save; Editor still saves.
  6. Enter a valid Task Code for your Class — the Task opens; enter one not set for your Class — "not found", as before.

## Out of Scope

- Removing duplicate access rules (Phase 3).
- The Teacher sign-up and visibility redesign (Phase 3).
- Any change to the locked save, Guest functions or Task-by-code for Classes.

## Further Notes

- Follows the agreed rule: Supabase changes are proposed with exact SQL, a check and an undo, then reviewed, agreed with Kiddy and run by a person.
- Can be run independently of the "Resubmitted" spec.
