## What

## Why

## How to verify

- [ ] `npm run lint && npm run typecheck && npm run test:unit`
- [ ] `PLATFORM=android npm test` on an emulator (or `--mochaOpts.grep @smoke`)
- [ ] `PLATFORM=ios npm test` on a simulator if iOS code changed

## Checklist

- [ ] New tests carry `@smoke` or `@regression` in their title
- [ ] Selectors go through `src/utils/selectors.ts` (no raw XPath)
- [ ] No fixed `pause()`; waits are condition-based
- [ ] No credentials or device-cloud ids committed
