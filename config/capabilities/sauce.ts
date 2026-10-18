import { buildName } from '../env';
import type { Env } from '../env';

/**
 * Sauce Labs real-device cloud. Devices are selected by name regex so a run never
 * blocks on one specific unit being free. Credentials are injected by
 * @wdio/sauce-service from SAUCE_USERNAME / SAUCE_ACCESS_KEY; nothing here is secret.
 */
export function sauceCapabilities(env: Env): WebdriverIO.Capabilities {
  const common = {
    'appium:newCommandTimeout': 240,
    'sauce:options': {
      build: buildName(env),
      name: `${env.PLATFORM} · wdio-native-demo`,
      appiumVersion: 'latest',
      // Real devices: cache the app between sessions on the same device.
      cacheId: `wdio-native-demo-${env.PLATFORM}`,
      resigningEnabled: true,
    },
  } as const;

  if (env.PLATFORM === 'ios') {
    return {
      platformName: 'iOS',
      'appium:automationName': 'XCUITest',
      'appium:deviceName': env.SAUCE_IOS_DEVICE,
      'appium:app': env.SAUCE_IOS_APP,
      ...common,
    };
  }
  return {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': env.SAUCE_ANDROID_DEVICE,
    'appium:app': env.SAUCE_ANDROID_APP,
    'appium:appWaitActivity': '*',
    'appium:autoGrantPermissions': true,
    ...common,
  };
}

export function sauceHost(env: Env): { hostname: string; port: number; path: string } {
  return { hostname: `ondemand.${env.SAUCE_REGION}.saucelabs.com`, port: 443, path: '/wd/hub' };
}
