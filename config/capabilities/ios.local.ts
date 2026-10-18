import path from 'node:path';
import { APPS_DIR, APP_FILES } from '../env';
import type { Env } from '../env';

/** Local iOS simulator driven by XCUITest. */
export function iosLocalCapabilities(env: Env): WebdriverIO.Capabilities {
  return {
    platformName: 'iOS',
    'appium:automationName': 'XCUITest',
    'appium:deviceName': env.IOS_DEVICE_NAME,
    ...(env.IOS_PLATFORM_VERSION && { 'appium:platformVersion': env.IOS_PLATFORM_VERSION }),
    'appium:app': env.APP_IOS ?? path.join(APPS_DIR, APP_FILES.ios),
    'appium:newCommandTimeout': 240,
    // WebDriverAgent is compiled on first run; CI runners need the long timeouts.
    'appium:wdaLaunchTimeout': 240_000,
    'appium:wdaConnectionTimeout': 240_000,
    'appium:simulatorStartupTimeout': 300_000,
    'appium:wdaStartupRetries': 3,
    'appium:showXcodeLog': false,
    'appium:autoAcceptAlerts': false,
    'appium:includeSafariInWebviews': false,
  };
}
