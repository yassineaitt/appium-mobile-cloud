import { homeScreen } from '@screens/home.screen';
import { loginScreen } from '@screens/login.screen';
import { formsScreen } from '@screens/forms.screen';
import { swipeScreen } from '@screens/swipe.screen';
import { tabBar } from '@screens/components/tab-bar.component';

describe('App launch and navigation', () => {
  it('launches on the Home screen @smoke', async () => {
    await homeScreen.waitForIsShown();
    await expect(homeScreen.container).toBeDisplayed();
  });

  it('navigates between pinned tabs @regression', async () => {
    await tabBar.open('Login');
    await loginScreen.waitForIsShown();

    await tabBar.open('Forms');
    await formsScreen.waitForIsShown();

    await tabBar.open('Swipe');
    await swipeScreen.waitForIsShown();

    await tabBar.open('Home');
    await homeScreen.waitForIsShown();
  });
});
