---
status: proposed
---

# New Teachers need an MOE school account

Only an `@moe.edu.sg` account can become a new Teacher. This replaces the "anyone with an email address" part of [ADR 0001](0001-open-teacher-signup-scoped-to-classes.md); its per-Class access rules stay. Accounts that existed before the rule keep working, which covers the group's NIE and email-and-password accounts. The rule is enforced by Supabase when an account is created, not by the app, so it cannot be bypassed by calling Supabase directly. MOE email accounts are Google accounts, so Google confirms the email is real.

## Considered Options

- **Keep open sign-up** (ADR 0001): rejected, because a stranger's Gmail account became a Teacher within days of Google sign-in going live.
- **Allow `@moe.edu.sg` and `@g.nie.edu.sg`**: rejected; the app is for MOE teachers, and the trainees who need it already have accounts.
- **Apply the rule to every sign-in, not just new accounts**: rejected, because it would cut the group off from accounts that hold their Classes, and moving to MOE accounts would mean re-linking every Class by hand.
- **Check the email in the app only**: rejected, because the account would still be created and anyone could sign up through Supabase directly.

## Consequences

- A future trainee with only an NIE account cannot join as a new Teacher.
- A Teacher added by hand in the Supabase dashboard must also have an `@moe.edu.sg` email.
- Students, who sign in anonymously without an email, must always be let through by the rule.
