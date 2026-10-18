import { byId } from '@utils/selectors';

/**
 * Every screen in the demo app wraps its content in a container tagged
 * `<Name>-screen`. The base class turns that into a uniform "am I here?" check.
 */
export abstract class BaseScreen {
  protected constructor(private readonly screenId: string) {}

  get container(): ChainablePromiseElement {
    return $(byId(this.screenId));
  }

  async waitForIsShown(isShown = true, timeout = 20_000): Promise<void> {
    await this.container.waitForDisplayed({ timeout, reverse: !isShown });
  }

  async isShown(): Promise<boolean> {
    return this.container.isDisplayed();
  }
}
