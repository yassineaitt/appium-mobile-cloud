/**
 * Gesture helpers built on WebdriverIO's W3C-actions-based `swipe` command so the same
 * code runs on emulators, simulators and real devices without vendor extensions.
 */
export async function swipeLeft(element: ChainablePromiseElement, percent = 0.9): Promise<void> {
  await browser.swipe({ direction: 'left', scrollableElement: element, percent, duration: 600 });
}

export async function swipeRight(element: ChainablePromiseElement, percent = 0.9): Promise<void> {
  await browser.swipe({ direction: 'right', scrollableElement: element, percent, duration: 600 });
}
