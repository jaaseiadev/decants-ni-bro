# Atomic Structure & Process Rules

## Branching Strategy
We follow a simplified Gitflow process with strict rules for feature branches and merges.

- **`main`**: The production-ready branch. Always deployable.
- **`develop`**: The integration branch for new features before they are tested and released to `main`.
- **`feature/*`**: Branches for adding new functionalities. Tracked against specific utilities or tickets (e.g., `feature/01-foundation-platform`).
- **`fix/*`**: Branches intended for bug fixes during active development.
- **`docs/*`**: Branches focused solely on documentation updates (e.g., `docs/project-overview`).

**Note**: All work begins from `develop` except hotfixes, which stem directly from `main`.

## Merge Rules
- **Regular Merge Only**: When completing a pull request (PR) or merging a branch into `develop` or `main`, we strictly employ a regular merge commit (`--no-ff`).
- **No Squash Merges**: Squash merging is strictly forbidden to preserve the true history and atomic commits of the development branch.
- PRs must be reviewed and approved by at least one other team member.

## Commit Message Conventions
We adhere to the [Conventional Commits](https://www.conventionalcommits.org/) specification format.

### Allowed Prefix Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- `ci`: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

### Commit Message Format
```
<type>(<scope>): <subject>

<body>
```

### Examples
- New feature: `feat(catalog): add product search functionality`
- Bug fix: `fix(auth): resolve session timeout issue`
- Documentation: `docs(project): add initial project overview and tech stack`

## Implementation Phase Order
1.  **Project Overview** (`00-project-overview.md`)
2.  **Foundation Platform** (`01-foundation-platform.md`)
3.  **Design System Shell** (`02-design-system-shell.md`)
4.  **Auth Route Protection** (`03-auth-route-protection.md`)
5.  **Database API Layer** (`04-database-api-layer.md`)
6.  **Public Catalog** (`05-public-catalog.md`)
7.  **Admin Dashboard** (`06-admin-dashboard.md`)
8.  **Admin Catalog** (`07-admin-catalog.md`)
9.  **Inventory Management** (`08-inventory-management.md`)
10. **Sales Recording** (`09-sales-recording.md`)
11. **Statistics Analytics** (`10-statistics-analytics.md`)
