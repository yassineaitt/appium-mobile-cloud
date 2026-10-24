import { describe, expect, it } from 'vitest';

import { isSystemAnr } from '@utils/system-dialogs';

describe('isSystemAnr', () => {
  it.each([
    "System UI isn't responding",
    "Pixel Launcher isn't responding",
    'Settings isn’t responding',
    "SYSTEM UI ISN'T RESPONDING",
  ])('recognises the ANR dialog text %j', (text) => {
    expect(isSystemAnr(text)).toBe(true);
  });

  it.each(['You are logged in!', 'This button is active', ''])(
    'leaves app alert text alone: %j',
    (text) => {
      expect(isSystemAnr(text)).toBe(false);
    },
  );
});
