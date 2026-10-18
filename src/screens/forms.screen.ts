import { byId, byText } from '@utils/selectors';
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

  get dropdownPlaceholder(): ChainablePromiseElement {
    return $(byText('Select an item...'));
  }

  async selectDropdownOption(label: string): Promise<void> {
    const option = $(byText(label));
    // The picker's touchable wrapper is marked non-accessible; tapping the visible
    // placeholder text is what a user does and works on both platforms.
    await this.dropdownPlaceholder.click();
    const opened = await option.waitForDisplayed({ timeout: 5_000 }).catch(() => false);
    if (!opened) {
      await this.dropdown.click();
      await option.waitForDisplayed({ timeout: 10_000 });
    }
    await option.click();
  }

  dropdownValue(label: string): ChainablePromiseElement {
    return $(byText(label));
  }
}

export const formsScreen = new FormsScreen();
