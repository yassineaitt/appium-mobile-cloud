import { buildName } from '../env';
import type { Env } from '../env';

/**
 * BrowserStack App Automate real-device cloud, addressed as a plain remote hub so the
 * profile has no dependency on a service plugin's WebdriverIO major version.
 * The app must already be uploaded (`npm run apps:upload`) and referenced as bs://<id>.
 */
export function browserstackCapabilities(env: Env): WebdriverIO.Capabilities {
  const isIos = env.PLATFORM === 'ios';
  const app = isIos ? env.BROWSERSTACK_IOS_APP : env.BROWSERSTACK_ANDROID_APP;
  if (!app) {
    throw new Error(
      `BROWSERSTACK_${isIos ? 'IOS' : 'ANDROID'}_APP is not set. Run "npm run apps:upload" and export the bs:// id.`,
    );
  }
  return {
    platformName: isIos ? 'iOS' : 'Android',
    'appium:automationName': isIos ? 'XCUITest' : 'UiAutomator2',
    'appium:app': app,
    'appium:newCommandTimeout': 240,
    ...(isIos ? {} : { 'appium:appWaitActivity': '*', 'appium:autoGrantPermissions': true }),
    'bstack:options': {
      deviceName: isIos ? env.BROWSERSTACK_IOS_DEVICE : env.BROWSERSTACK_ANDROID_DEVICE,
      osVersion: isIos ? env.BROWSERSTACK_IOS_OS : env.BROWSERSTACK_ANDROID_OS,
      projectName: 'appium-mobile-cloud',
      buildName: buildName(env),
      sessionName: `${env.PLATFORM} · wdio-native-demo`,
      appiumVersion: '2.0.1',
      debug: true,
      networkLogs: true,
      deviceLogs: true,
      idleTimeout: 120,
    },
  };
}

export const BROWSERSTACK_HOST = {
  hostname: 'hub.browserstack.com',
  port: 443,
  path: '/wd/hub',
} as const;
