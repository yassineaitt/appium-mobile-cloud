/**
 * Android emulators on shared CI runners occasionally raise "System UI isn't responding"
 * (an ANR for the system shell, not for the app under test). The dialog sits above every
 * tap target and makes a healthy app look broken. Dismissing it with "Wait" is exactly what
 * a human would do; this helper does it cheaply before each test and no-ops everywhere else.
 */
const ANR_WAIT_BUTTON =
  'android=new UiSelector().className("android.widget.Button").textMatches("(?i)wait")';
const ANR_TITLE = 'android=new UiSelector().textContains("isn\'t responding")';

/** True for the text of an Android ANR dialog ("System UI isn't responding", "Pixel Launcher isn't responding"). */
export function isSystemAnr(text: string): boolean {
  return /isn['’]t responding/i.test(text);
}

export async function dismissSystemDialogs(): Promise<boolean> {
  if (!driver.isAndroid) return false;
  const title = await $$(ANR_TITLE);
  if (title.length === 0) return false;
  const wait = $(ANR_WAIT_BUTTON);
  if (await wait.isExisting()) {
    await wait.click();
    console.warn('[system-dialogs] dismissed an ANR dialog');
    return true;
  }
  return false;
}
