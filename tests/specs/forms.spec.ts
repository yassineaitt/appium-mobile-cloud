import { formsScreen } from '@screens/forms.screen';
import { nativeAlert } from '@screens/components/native-alert.component';
import { tabBar } from '@screens/components/tab-bar.component';
import { messages } from '@data/users';

describe('Form components', () => {
  beforeEach(async () => {
    await tabBar.open('Forms');
    await formsScreen.waitForIsShown();
  });

  it('echoes typed text into the result field @smoke', async () => {
    await formsScreen.typeText('Hello Appium');

    await expect(formsScreen.inputResult).toHaveText('Hello Appium');
  });

  it('toggles the switch and its label @regression', async () => {
    await expect(formsScreen.switchText).toHaveText('Click to turn the switch ON');

    await formsScreen.toggleSwitch();
    await expect(formsScreen.switchText).toHaveText('Click to turn the switch OFF');

    await formsScreen.toggleSwitch();
    await expect(formsScreen.switchText).toHaveText('Click to turn the switch ON');
  });

  it('selects an option from the dropdown @regression', async () => {
    await formsScreen.selectDropdownOption('Appium is awesome');

    await expect(formsScreen.dropdownValue('Appium is awesome')).toBeDisplayed();
  });

  it('shows a native alert from the active button @regression', async () => {
    await formsScreen.activeButton.click();

    await nativeAlert.waitForIsShown();
    await expect(nativeAlert.text()).resolves.toContain(messages.activeButtonAlert);
    await nativeAlert.pressButton('OK');
    await nativeAlert.waitForIsShown(false);
  });

  it('does nothing when the inactive button is tapped @regression', async () => {
    await formsScreen.inactiveButton.click();

    await expect(nativeAlert.isShown()).resolves.toBe(false);
    await expect(formsScreen.container).toBeDisplayed();
  });
});
