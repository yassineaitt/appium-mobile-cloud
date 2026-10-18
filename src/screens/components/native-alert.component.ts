import { alertSelectors } from '@utils/selectors';

/**
 * Native alert dialogs (UIAlertController / AlertDialog). Uses the WebDriver alert
 * endpoints where they work and falls back to element lookups for existence checks,
 * because `getAlertText` throws instead of returning "no alert".
 */
class NativeAlert {
  async waitForIsShown(isShown = true, timeout = 10_000): Promise<void> {
    await $(alertSelectors.container()).waitForExist({ timeout, reverse: !isShown });
  }

  async isShown(): Promise<boolean> {
    return $(alertSelectors.container()).isExisting();
  }

  async text(): Promise<string> {
    return driver.getAlertText();
  }

  async pressButton(label: string): Promise<void> {
    await $(alertSelectors.button(label)).click();
  }

  async accept(): Promise<void> {
    await driver.acceptAlert();
  }
}

export const nativeAlert = new NativeAlert();
