# Contributing

## Setup

```bash
nvm use                     # Node 22.19+
npm ci                      # deps + Husky hooks
npm run apps:download       # demo apps into apps/ (checksum verified, gitignored)
npm run appium:setup        # UiAutomator2 + XCUITest drivers into ./.appium
npm run appium:doctor       # tells you what is missing on this machine
cp .env.example .env        # optional overrides
```

Android needs an emulator (or USB device) visible in `adb devices`; iOS needs Xcode with at
least one iPhone simulator. Nothing else is required for `CLOUD=local`.

## Workflow

1. Branch from `main`: `feat/…`, `fix/…`, `test/…`, `ci/…`.
2. Run the local gate before pushing:

   ```bash
   npm run lint && npm run typecheck && npm run test:unit
   PLATFORM=android npm test -- --mochaOpts.grep @smoke
   ```

3. Open a PR. CI runs the Android emulator and iOS simulator suites; real-device cloud jobs
   run only when the repository has the provider secrets.

## Commit messages

Conventional Commits, enforced by commitlint. Types in use: `feat`, `fix`, `test`, `ci`,
`build`, `docs`, `chore`, `refactor`. Header ≤ 100 characters.

## Where things go

| Adding…                         | Goes in…                         | Rule                                                         |
| ------------------------------- | -------------------------------- | ------------------------------------------------------------ |
| A screen                        | `src/screens/`                   | Extend `BaseScreen`; expose intent + elements, no assertions |
| A reusable widget (alert, tabs) | `src/screens/components/`        | Platform differences stay inside the component               |
| A selector that differs per OS  | `src/utils/selectors.ts`         | Prefer `~accessibility-id`; never XPath                      |
| A gesture                       | `src/utils/gestures.ts`          | W3C actions / `browser.swipe`, no vendor `mobile:` scripts   |
| A new cloud or device profile   | `config/capabilities/`           | Pure function of `Env`; no secrets, no `process.env` reads   |
| An env variable                 | `config/env.ts` + `.env.example` | Validate with Zod, document the default                      |
| A spec                          | `tests/specs/`                   | Title carries `@smoke` or `@regression`                      |
| Config logic worth unit testing | `tests/unit/`                    | Vitest, no device needed                                     |

## Rejected in review

- `browser.pause()` / fixed sleeps (ESLint `wdio/no-pause`).
- XPath selectors or coordinates hard-coded for one screen size.
- Assertions inside screen objects.
- Credentials, `bs://` ids or Sauce storage ids in tracked files.
