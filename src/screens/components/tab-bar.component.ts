import { byId } from '@utils/selectors';

export type TabName = 'Home' | 'Webview' | 'Login' | 'Forms' | 'Swipe' | 'Drag';

/** Bottom tab bar. Tabs expose their label as the accessibility name on both platforms. */
class TabBar {
  tab(name: TabName): ChainablePromiseElement {
    return $(byId(name));
  }

  async open(name: TabName): Promise<void> {
    const tab = this.tab(name);
    await tab.waitForDisplayed({ timeout: 20_000 });
    await tab.click();
  }
}

export const tabBar = new TabBar();
