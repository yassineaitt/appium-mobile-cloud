import { alertSelectors } from '@utils/selectors';

/**
 * Native alert dialogs (UIAlertController / AlertDialog). Presence is detected through the
 * WebDriver alert endpoint, which both XCUITest and UiAutomator2 implement for system
 * dialogs, so it does not depend on platform-specific view ids. `getAlertText` throws when
 * no alert is open, hence the try/catch.
 */
class NativeAlert {
  async waitForIsShown(isShown = true, timeout = 10_000): Promise<void> {
    await browser.waitUntil(async () => (await this.isShown()) === isShown, {
      timeout,
      timeoutMsg: `expected native alert to be ${isShown ? 'shown' : 'gone'} within ${timeout}ms`,
    });
  }

  async isShown(): Promise<boolean> {
    try {
      await driver.getAlertText();
      return true;
    } catch {
      return false;
    }
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
