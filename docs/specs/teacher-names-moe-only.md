# Spec: Teacher Names, and new Teachers need an MOE account

Status: draft · App changes on amos-branch · Supabase part to be proposed, not applied · Decision: [ADR 0002](../adr/0002-new-teachers-need-moe-account.md)

## Problem Statement

A Teacher is shown everywhere by their email address: the role badge and the "Continue as …" button both show the email. The app does keep a name for each Teacher, but it fills it with the email and overwrites it on every sign-in, and never shows it. Teachers want to be called by a name they choose.

Separately, anyone with any Google account can become a Teacher just by clicking "Sign in with Google". A stranger's personal Gmail account already has. They see no Classes, but they should not be able to get an account at all. The app is meant for MOE teachers, and MOE email accounts are Google accounts, so Google can confirm the email is real.

## Solution

Two linked changes:

1. **Only `@moe.edu.sg` accounts can become new Teachers.** Supabase refuses to create any new Teacher account with another email. Teachers who already have accounts, including the group's NIE and email-and-password accounts, keep them. Students are unaffected. A refused person sees: *"Only MOE school email accounts (@moe.edu.sg) can sign in as a Teacher."*
2. **Every Teacher has a Teacher Name.** At first sign-in, a box asks "What should we call you?", already filled with a suggestion made from the email (`tan_mei_ling@moe.edu.sg` becomes "Tan Mei Ling"). The Teacher can keep it or change it (for example to "Mei Ling") and presses Save. Existing Teachers get the same box once, at their next sign-in. The name replaces the email on the Teacher's own screens, and an **Edit name** button lets them change it later.

## User Stories

1. As a new MOE teacher, I want to sign in with my `@moe.edu.sg` Google account and be a Teacher straight away, so that I can start without asking anyone.
2. As someone with a non-MOE Google account, I want a clear message saying only MOE accounts can sign in as a Teacher, so that I know why I was refused.
3. As the group, I want strangers refused before an account is created, so that no stray Teacher accounts pile up.
4. As one of the group's existing Teachers, I want my NIE or email-and-password account to keep working, with all my Classes, so that the rule does not lock us out.
5. As a student, I want signing in with a Task Code to work exactly as before, so that nothing changes for me.
6. As a new Teacher, I want to be asked my name at first sign-in with a sensible suggestion already filled in, so that I can just press Save or type what I prefer.
7. As an existing Teacher, I want to be asked my name once at my next sign-in, so that I get a name too.
8. As a Teacher, I want my name, not my email, in the role badge and on the "Continue as" button, so that the app feels like mine.
9. As a Teacher, I want an Edit name button on my dashboard, with my email shown for reference, so that I can change my name at any time.
10. As a Teacher, I want my chosen name to stay after I sign out and back in, so that I don't have to set it again.

## Implementation Decisions

- **The email rule lives in Supabase, as a "before user created" Auth Hook** (Authentication → Auth Hooks). It runs only when an account is about to be created, so existing accounts are untouched by design. It:
  - allows any account with no email, which covers students' anonymous sign-ins;
  - allows emails ending in `@moe.edu.sg` (case-insensitive);
  - refuses everything else, with the message above.
  It covers every way an account can be created: Google, email sign-up through the API, and accounts added by hand in the dashboard.
- **Google sign-in is the only way in for new Teachers.** There is no sign-up form. Email-and-password sign-in stays for existing accounts. Google's account chooser is not filtered to MOE accounts, because the group's NIE accounts must still be selectable.
- **The app shows the refusal message.** When Google sign-in comes back with the hook's refusal, the Teacher sign-in box shows the agreed message instead of today's generic "Google sign-in did not finish: …".
- **The Teacher Name is stored in the existing `teacher_profiles.display_name`.** No new column is needed. Teachers can already update only their own profile.
- **Signing in no longer overwrites the name.** Today `finishTeacherSignIn` (app.js) upserts `display_name = email` on every sign-in. Instead it creates the profile with no name if it is missing, and leaves an existing name alone.
- **"Needs a name" means the name is empty or still an email address** (contains `@`). That is how existing Teachers, whose name is currently their email, get asked once.
- **The suggestion is made from the email, not from Google's name.** Take the part before `@`, turn `_` and `.` into spaces, and capitalise each word. Google's names are unreliable ("KHAN JUN MING, AMOS", "ML BB").
- **Name rules:** trimmed, not blank, at most 40 characters. Checked in the box, and also by a database check on `display_name` so a bad value cannot be saved another way. Existing email values are longer than 40 characters in some cases, so the check must allow them until each Teacher renames (for example, check only new values, or reset them to empty first). The proposed SQL decides which.
- **The name box has no Skip button.** The Teacher dashboard opens only after a name is saved.
- **Where the name appears:** the role badge and the "Continue as …" button. The Edit name box shows the Teacher's email underneath, read-only.
- **Only the Teacher sees their own name.** Other Teachers' names are not shown anywhere. The database already lets any Teacher read all profiles; that is unchanged and not used.
- **Supabase changes are proposed as SQL for Kiddy to review and apply**, with an undo script, like earlier phases: the hook function, and the name check.

## Testing Decisions

- **Rehearse the hook away from the live project first** (the separate rehearsal project or PGlite), since a mistake could stop students signing in.
- **Checklist** (rehearsal, then live in a quiet moment):
  1. A new `@moe.edu.sg` Google account signs in: the account is created, the name box appears with the suggestion, and Save opens an empty dashboard.
  2. A new non-MOE Google account (for example a personal Gmail): no account is created in Supabase → Users, and the agreed message is shown.
  3. An existing NIE account signs in: it works, and its Classes are still there. It is asked for a name once.
  4. An existing email-and-password account signs in: it works and is asked for a name once.
  5. A student enters a Task Code, picks a name, draws and submits: all as before. A Guest: same.
  6. After saving a name: the badge and "Continue as" show it; sign out and in again, and it is still there and not asked again.
  7. Edit name: change it, and the badge updates. A blank name or one over 40 characters is refused.
  8. Undo the SQL on the rehearsal project: any Google account can sign up again.

## Out of Scope

- Showing Teacher Names to other Teachers or to students (for example "Reviewed by …").
- Approving individual Teachers, or a list of extra allowed domains (such as NIE).
- Moving existing Teachers onto MOE accounts.
- A Teacher sign-up form or Microsoft sign-in.
- Tidying up old anonymous student sign-ins in Supabase.
- Deleting the stranger's account, which Amos does by hand.

## Further Notes

- Partly replaces [ADR 0001](../adr/0001-open-teacher-signup-scoped-to-classes.md): Teachers still only see their own Classes, but sign-up is no longer open to any email.
- Vocabulary follows GLOSSARY.md (Teacher, Teacher Name, Class).
