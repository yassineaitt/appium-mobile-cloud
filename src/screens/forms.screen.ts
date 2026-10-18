import { byId, byTestId, firstText } from '@utils/selectors';
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

  /** The picker's chevron carries a raw testID and toggles the list on both platforms. */
  get dropdownChevron(): ChainablePromiseElement {
    return $(byTestId('dropdown-chevron'));
  }

  async selectDropdownOption(label: string): Promise<void> {
    const option = firstText(label);
    await this.dropdownChevron.click();
    const opened = await option.waitForDisplayed({ timeout: 5_000 }).catch(() => false);
    if (!opened) {
      // Fallback: the touchable wrapper (accessible=false, but still tappable by id).
      await this.dropdown.click();
      await option.waitForDisplayed({ timeout: 10_000 });
    }
    await option.click();
  }

  dropdownValue(label: string): ChainablePromiseElement {
    return firstText(label);
  }
}

export const formsScreen = new FormsScreen();
