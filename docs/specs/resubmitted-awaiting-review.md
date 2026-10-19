# Spec: "Resubmitted – awaiting review"

> **Superseded 20 Oct 2026** by `handed-in-is-final.md`: handing in is now final, so a Project can no longer be Resubmitted.

Status: draft · Phase 2, item 5 · One Supabase change (proposed, not applied) + front end · Tracked in [issue #7](https://github.com/akiddurrani-bit/Outdoor_Education_P5/issues/7)

## Problem Statement

A student can keep improving a Project after a Teacher has Marked it and submit it again. The Teacher has no way to see this: the Project still just says "Marked", so improved work sits unreviewed, and the student keeps seeing old feedback on work that has moved on. The app cannot even tell the difference today, because when a Roster student submits again the database keeps the time of the **first** submission instead of the latest one. (Guests already record the latest time — the two save paths are inconsistent.)

## Solution

Every submission records the time it was handed in, for Roster students as it already does for Guests. With that, the Teacher's Student Maps list can show **"Resubmitted – awaiting review"** on any Marked Project that was handed in again after its Review was last saved. When the Teacher saves a fresh Review, the label goes back to "Marked". Students keep seeing the previous Review until then, as the glossary defines.

## User Stories

1. As a Teacher, I want a Project that was handed in again after I Marked it to show "Resubmitted – awaiting review", so that I know improved work is waiting for me.
2. As a Teacher, I want the label to disappear as soon as I save a new Review, so that the list shows what still needs my attention.
3. As a Teacher, I want the label to appear live (within the list's normal ~10 s refresh), so that I do not need to press Refresh.
4. As a Teacher, I want the Submitted time I see to be the latest hand-in, not the first, so that I know how recent the work is.
5. As one of several Teachers sharing a Class, I want everyone's list to show the same "Resubmitted" state, so that whoever is free can pick it up.
6. As a student, I want resubmitting to keep working exactly as now (I can keep editing and resubmit), so that nothing about my workflow changes.
7. As a student, I want to keep seeing my previous Review after resubmitting until my Teacher saves a new one, so that I am never left with no feedback.
8. As a student in a Group, I want a resubmission by any member to count for the whole Group, as submission already does.
9. As a Guest, I want resubmission to behave the same as for Roster students (it already records the latest time).
10. As the group, I want the database change to be one line, reviewed by us and agreed with Kiddy before it is run, so that the live demo is not put at risk.
11. As the group, I want an exact undo for the database change, so that we can put it back if anything goes wrong.

## Implementation Decisions

- **Database (proposed, not applied).** In the Roster-student save function, a submit sets the submission time to "now" instead of "keep the first time if there is one". Nothing else in that function changes. The locked save function used by the current app calls this one, so it picks up the change automatically. The Guest save function already behaves this way.
- **Front end.** The Teacher's Student Maps rows (issue #4) already load each Project's status, its submission time and its Review's last-saved time. A row is **Resubmitted** when the Project is Submitted, has a non-empty Review, and its submission time is later than the Review's last-saved time. The row then shows "Resubmitted – awaiting review" instead of "Marked · <time>", and is highlighted once when it changes into this state (same highlight as a new submission).
- **Order of rollout.** The front end can ship before or after the database change: until the database change is run, resubmissions keep the first time, so the label simply never appears. No breakage either way.
- **Known limitation, accepted.** The first time a Review is created, its last-saved time comes from the Teacher's device clock rather than the database clock. A device clock that is minutes wrong could briefly mislabel a Project. Fine for the demo; Phase 3 can make the database set that time too.
- **Out of the student view for now.** Students' My Projects cards are unchanged; the label is for Teachers.

## Proposed SQL (for review — do not run until agreed with Kiddy)

Change (only the marked line differs from the current definition):

```sql
CREATE OR REPLACE FUNCTION public.student_save_project(p_submission_id uuid, p_student_id uuid, p_map_data jsonb, p_submit boolean DEFAULT false)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_status text;
begin
  if not exists (
    select 1
    from public.student_sessions session_link
    join public.submission_members sm
      on sm.student_id = session_link.student_id
    where session_link.auth_uid = auth.uid()
      and session_link.student_id = p_student_id
      and sm.submission_id = p_submission_id
  )
  then
    raise exception 'This project does not belong to the selected student.';
  end if;

  update public.submissions
  set
    map_data = coalesce(p_map_data, '{}'::jsonb),
    status = case when p_submit then 'submitted' else status end,
    submitted_at = case
      when p_submit then now()          -- was: coalesce(submitted_at, now())
      else submitted_at
    end,
    updated_at = now()
  where id = p_submission_id
  returning status into v_status;

  return v_status;
end;
$function$;
```

Undo: run the same statement with the marked line restored to `when p_submit then coalesce(submitted_at, now())`. The full original definition is in the schema snapshot taken on 19 Oct 2026.

Check afterwards (read-only) — expect `false`, `true`. (Match on `then …`, because the function keeps the `-- was:` comment, which also contains `coalesce(submitted_at`.)

```sql
select
  pg_get_functiondef('public.student_save_project(uuid, uuid, jsonb, boolean)'::regprocedure) ~ 'then\s+coalesce\(\s*submitted_at' as still_keeps_first_time,
  pg_get_functiondef('public.student_save_project(uuid, uuid, jsonb, boolean)'::regprocedure) ~ 'then\s+now\(\)' as now_records_latest_time;
```

Then, as a TEST student, submit, wait a minute, submit again — the Teacher's list should show the later time.

## Testing Decisions

- **One seam, at the top: two real browsers**, as in Phase 1. Checks look only at what a person sees.
- **Where to test.** Only in a TEST Class with a TEST Task.
- **Checklist** (A = Teacher, B = student):
  1. B submits. A saves a Review. A's row shows "Marked · <time>".
  2. B edits and submits again. Within ~10 s A's row shows "Resubmitted – awaiting review", highlighted once. (Before the database change is run: stays "Marked" — expected.)
  3. B still sees the previous Review on their Project.
  4. A saves a new Review. A's row returns to "Marked · <new time>".
  5. B only edits (no submit) after being Marked: A's row stays "Marked".
  6. Group: a groupmate resubmits; A sees "Resubmitted".
  7. Guest: resubmit after Marked; A sees "Resubmitted".

## Out of Scope

- Showing "Resubmitted" to students.
- Keeping a history of earlier submissions or earlier Reviews.
- Making the database set the Review's first save time (Phase 3).
- Any other Supabase change.

## Further Notes

- Follows the agreed rule: Supabase changes are proposed with exact SQL and an undo, then reviewed, agreed with Kiddy and run by a person — never applied automatically.
- Builds on issue #4 (the live Student Maps list).
- Vocabulary follows GLOSSARY.md (Submitted, Marked, Resubmitted, Review, Project, Group, Guest).
