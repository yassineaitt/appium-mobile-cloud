/** Hide the soft keyboard without caring which platform we are on. */
export async function hideKeyboard(): Promise<void> {
  if (!(await driver.isKeyboardShown())) return;
  if (driver.isAndroid) {
    await driver.hideKeyboard();
    return;
  }
  // iOS: hideKeyboard is unreliable with RN inputs; tapping "Done"/"Return" or a neutral
  // area is the documented workaround.
  const done = await $(
    '-ios predicate string:type == "XCUIElementTypeButton" AND name IN {"Done","Return","return"}',
  );
  if (await done.isExisting()) {
    await done.click();
  } else {
    const { width, height } = await driver.getWindowSize();
    await driver
      .action('pointer', { parameters: { pointerType: 'touch' } })
      .move({ x: Math.round(width / 2), y: Math.round(height * 0.12) })
      .down()
      .up()
      .perform();
  }
}
