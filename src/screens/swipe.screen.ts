import { byId, byText } from '@utils/selectors';
import { swipeLeft, swipeRight } from '@utils/gestures';
import { BaseScreen } from './base.screen';

/** Carousel titles are rendered upper-cased by the app. */
export const CAROUSEL_TITLES = [
  'FULLY OPEN SOURCE',
  'GREAT COMMUNITY',
  'JS.FOUNDATION',
  'SUPPORT VIDEOS',
  'EXTENDABLE',
  'COMPATIBLE',
] as const;

class SwipeScreen extends BaseScreen {
  constructor() {
    super('Swipe-screen');
  }

  get card(): ChainablePromiseElement {
    return $(byId('card'));
  }

  cardTitle(title: string): ChainablePromiseElement {
    return $(byText(title));
  }

  async next(): Promise<void> {
    await swipeLeft(this.card);
  }

  async previous(): Promise<void> {
    await swipeRight(this.card);
  }
}

export const swipeScreen = new SwipeScreen();
