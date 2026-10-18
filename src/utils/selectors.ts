/**
 * Platform-aware selector builders. The demo app exposes the same identifier on both
 * platforms (iOS testID / Android content-desc), so `~id` covers 90 % of cases; these
 * helpers handle the rest (visible text, native alert chrome).
 */
export const byId = (id: string): string => `~${id}`;

export function byText(text: string): string {
  return driver.isIOS
    ? `-ios predicate string:label == "${text}" OR value == "${text}" OR name == "${text}"`
    : `android=new UiSelector().text("${text}")`;
}

export function byTextContaining(fragment: string): string {
  return driver.isIOS
    ? `-ios predicate string:label CONTAINS "${fragment}" OR value CONTAINS "${fragment}"`
    : `android=new UiSelector().textContains("${fragment}")`;
}

export const alertSelectors = {
  container: (): string =>
    driver.isIOS ? '-ios class chain:**/XCUIElementTypeAlert' : 'id=android:id/alertTitle',
  button: (label: string): string =>
    driver.isIOS
      ? `-ios predicate string:type == "XCUIElementTypeButton" AND name == "${label}"`
      : `android=new UiSelector().className("android.widget.Button").textMatches("(?i)${label}")`,
};
