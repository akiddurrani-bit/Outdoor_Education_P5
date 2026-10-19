# Spec: Rosters use first name and register number

Status: draft · Phase 3, item 11 · Front end only · Small

## Problem Statement

Rosters will hold real Primary 1–6 children's names. Today Teachers upload whatever the school's class list contains — usually full names — and students see the whole Roster when picking their own name. Collecting less identifying information about children is safer, and the register number already tells two children with the same first name apart.

## Solution

The Roster screens guide Teachers to use **first name + register number** only, and nudge them when an upload looks like full names. Students see names as "12 · Amir". Nothing is enforced — some schools need surnames to tell children apart — but the default and the guidance point the safe way.

## User Stories

1. As a Teacher uploading a class list, I want the upload card to say "Use first names only; the register number tells children apart", so that I know what to upload.
2. As a Teacher, I want a warning before importing a list where most names have two or more words, so that I can go back and remove surnames.
3. As a Teacher, I want to import anyway if I decide surnames are needed, so that the app does not block me.
4. As a Teacher adding one student, I want the box to say "First name", so that I follow the same rule.
5. As a student, I want to see my register number next to my name ("12 · Amir"), so that I can pick myself even if a classmate has the same name.
6. As a parent or school, I want the app to hold as little about each child as it needs, so that their privacy is protected.

## Implementation Decisions

- **Guidance text** on the upload card and the "Add one student" box.
- **Soft check on import:** if more than half the names in the preview contain a space, show a warning with "Import anyway" / "Go back"; nothing is blocked.
- **Register numbers shown** wherever students pick a name (sign-in, Group choice), when a register number exists.
- **No database change.** Existing Rosters are not rewritten.

## Testing Decisions

- **One seam: the real Teacher and student screens.**
- **Checklist:** upload a list of full names → warning appears, both buttons work; upload first names only → no warning; add one student → placeholder says "First name"; student name lists show "12 · Amir".

## Out of Scope

- Enforcing first names, or editing existing Rosters automatically.
- A school-wide data-protection policy (schools will have their own rules).

## Further Notes

- Pairs naturally with items 9–10 (the student sign-in screens are being rebuilt there).
- Vocabulary follows GLOSSARY.md (Roster, Class, Teacher).
