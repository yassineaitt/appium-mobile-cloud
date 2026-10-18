import { CAROUSEL_TITLES, swipeScreen } from '@screens/swipe.screen';
import { tabBar } from '@screens/components/tab-bar.component';

describe('Swipe carousel', () => {
  beforeEach(async () => {
    await tabBar.open('Swipe');
    await swipeScreen.waitForIsShown();
  });

  it('shows the first card initially @smoke', async () => {
    await expect(swipeScreen.cardTitle(CAROUSEL_TITLES[0])).toBeDisplayed();
  });

  it('advances to the next card on a left swipe and back on a right swipe @regression', async () => {
    await swipeScreen.next();
    await expect(swipeScreen.cardTitle(CAROUSEL_TITLES[1])).toBeDisplayed();

    await swipeScreen.previous();
    await expect(swipeScreen.cardTitle(CAROUSEL_TITLES[0])).toBeDisplayed();
  });
});
