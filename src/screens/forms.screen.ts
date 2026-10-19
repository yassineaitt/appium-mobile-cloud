import { byButton, byId, firstText } from '@utils/selectors';
import { hideKeyboard } from '@utils/keyboard';
import { BaseScreen } from './base.screen';

class FormsScreen extends BaseScreen {
  constructor() {
    super('Forms-screen');
  }

  get input(): ChainablePromiseElement {
    return $(byId('text-input'));
  }
  get inputResult(): ChainablePromiseElement {
    return $(byId('input-text-result'));
  }
  get switch(): ChainablePromiseElement {
    return $(byId('switch'));
  }
  get switchText(): ChainablePromiseElement {
    return $(byId('switch-text'));
  }
  get dropdown(): ChainablePromiseElement {
    return $(byId('Dropdown'));
  }
  get activeButton(): ChainablePromiseElement {
    return $(byId('button-Active'));
  }
  get inactiveButton(): ChainablePromiseElement {
    return $(byId('button-Inactive'));
  }

  async typeText(text: string): Promise<void> {
    await this.input.setValue(text);
    await hideKeyboard();
  }

  async toggleSwitch(): Promise<void> {
    await this.switch.click();
  }

  /**
   * The dropdown is a native picker underneath: a UIPickerView with a "Done" toolbar on
   * iOS, a Spinner dialog on Android. Same intent, two platform flows.
   */
  async selectDropdownOption(label: string): Promise<void> {
    await this.dropdown.click();
    if (driver.isIOS) {
      const wheel = $('-ios class chain:**/XCUIElementTypePickerWheel');
      await wheel.waitForExist({ timeout: 10_000 });
      await wheel.addValue(label); // XCUITest scrolls the wheel to the matching row
      await $(byButton('Done')).click();
      return;
    }
    const option = firstText(label);
    await option.waitForDisplayed({ timeout: 10_000 });
    await option.click();
  }

  dropdownValue(label: string): ChainablePromiseElement {
    return firstText(label);
  }
}

export const formsScreen = new FormsScreen();
