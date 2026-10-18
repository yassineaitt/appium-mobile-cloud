/**
 * Platform-aware selector builders. The demo app exposes the same identifier on both
 * platforms (iOS testID / Android content-desc), so `~id` covers most cases; these
 * helpers handle the rest (visible text, buttons by name, native alert chrome).
 *
 * WebdriverIO 10 runs selectors in strict mode (`$` throws on multiple matches), so each
 * builder is written to resolve to exactly one node: text lookups target the text node
 * itself, never an accessible parent that aggregates the same label.
 */
export const byId = (id: string): string => `~${id}`;

/**
 * A text node showing exactly `text`. React Native on iOS can expose the same label on a
 * wrapper and its inner StaticText, so callers that need a single element use `firstText`.
 */
export function byText(text: string): string {
  return driver.isIOS
    ? `-ios predicate string:type == "XCUIElementTypeStaticText" AND (label == "${text}" OR value == "${text}")`
    : `android=new UiSelector().className("android.widget.TextView").text("${text}")`;
}

/** First element showing exactly `text`; lazy, so `waitForDisplayed` and `expect` still retry. */
export function firstText(text: string): ChainablePromiseElement {
  // WebdriverIO resolves `$$()[0]` lazily (a proxy), so it is never undefined at runtime;
  // the fallback only exists to satisfy noUncheckedIndexedAccess without a cast.
  const selector = byText(text);
  return $$(selector)[0] ?? $(selector);
}

/** Raw React Native testID: accessibility id on iOS, resource-id on Android. */
export function byTestId(id: string): string {
  return driver.isIOS ? `~${id}` : `id=${id}`;
}

/** A tappable control whose accessible name is `name` (tab bar items, native buttons). */
export function byButton(name: string): string {
  return driver.isIOS
    ? `-ios predicate string:type == "XCUIElementTypeButton" AND name == "${name}"`
    : `android=new UiSelector().description("${name}").clickable(true)`;
}

export const alertSelectors = {
  container: (): string =>
    driver.isIOS ? '-ios class chain:**/XCUIElementTypeAlert' : 'id=android:id/alertTitle',
  button: (label: string): string =>
    driver.isIOS
      ? `-ios predicate string:type == "XCUIElementTypeButton" AND name == "${label}"`
      : `android=new UiSelector().className("android.widget.Button").textMatches("(?i)${label}")`,
};
