# 00 Project Overview & Atomic Structure

## Mission
Define the project scope, branching strategy, commit conventions, and merge rules for the DecantSnibro perfume decanting web application.

## Success Criteria
- PROJECT-OVERVIEW.md documents the full scope — public catalog, admin dashboard, auth, inventory, sales, and statistics.
- Branching model (main → develop → feature/*) is documented and enforced.
- Commit message format follows conventional commits (feat, fix, refactor, docs, build, test).
- Merge rules documented: regular merge commits only (--no-ff), no squash merges.

## Prerequisites
- Team agreement on project scope and timeline.

## Logistics
- Source Branch: `main`
- Target Branch: `main`
- Feature Branch: `docs/project-overview`

## Atomic Steps
1. Draft PROJECT-OVERVIEW.md with app description, target users, key features, and tech stack.
2. Define ATOMIC-STRUCTURE.md with branching strategy and merge rules.
3. Document commit message conventions with examples.
4. Define implementation phase order and dependencies.
5. Create .github/PULL_REQUEST_TEMPLATE.md for consistent PR descriptions.

## Key Files / Areas
- `PROJECT-OVERVIEW.md`
- `ATOMIC-STRUCTURE.md`
- `.github/PULL_REQUEST_TEMPLATE.md`

## Verification
- Documentation:
  - All team members can reference branching and commit rules.
- Process:
  - First PR follows the documented merge flow.

## Definition of Done
- [ ] PROJECT-OVERVIEW.md merged and approved.
- [ ] ATOMIC-STRUCTURE.md merged and approved.
- [ ] All team members acknowledge conventions.

## Commit Flow
- `docs(project): add project overview and scope definition`
- `docs(process): add atomic structure branching and merge rules`

## Merge Rule Reminder
Merge using regular merge commit only (`--no-ff`). Squash merge is not allowed.
