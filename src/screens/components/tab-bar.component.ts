import { byButton } from '@utils/selectors';

export type TabName = 'Home' | 'Webview' | 'Login' | 'Forms' | 'Swipe' | 'Drag';

/**
 * Bottom tab bar. Tabs are accessible buttons named after their label on both platforms;
 * matching on the button role keeps the selector unique even when a screen shows the
 * same word elsewhere (e.g. the Login form on the Login tab).
 */
class TabBar {
  tab(name: TabName): ChainablePromiseElement {
    return $(byButton(name));
  }

  async open(name: TabName): Promise<void> {
    const tab = this.tab(name);
    await tab.waitForDisplayed({ timeout: 20_000 });
    await tab.click();
  }
}

export const tabBar = new TabBar();
