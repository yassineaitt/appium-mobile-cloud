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

  async selectDropdownOption(label: string): Promise<void> {
    await this.dropdown.click();
    const option = $(byText(label));
    await option.waitForDisplayed({ timeout: 10_000 });
    await option.click();
  }

  dropdownValue(label: string): ChainablePromiseElement {
    return $(byText(label));
  }
}

export const formsScreen = new FormsScreen();
