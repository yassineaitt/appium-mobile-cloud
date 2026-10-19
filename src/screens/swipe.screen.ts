import { byId, firstText } from '@utils/selectors';
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

  /** The carousel renders every slide; swipe on the screen container, whose centre is the active card. */
  get carousel(): ChainablePromiseElement {
    return $(byId('Swipe-screen'));
  }

  cardTitle(title: string): ChainablePromiseElement {
    return firstText(title);
  }

  async next(): Promise<void> {
    await swipeLeft(this.carousel, 0.6);
  }

  async previous(): Promise<void> {
    await swipeRight(this.carousel, 0.6);
  }
}

export const swipeScreen = new SwipeScreen();
