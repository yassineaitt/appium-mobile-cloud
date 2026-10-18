import path from 'node:path';
import { APPS_DIR, APP_FILES } from '../env';
import type { Env } from '../env';

/** Local Android emulator (or a USB device) driven by UiAutomator2. */
export function androidLocalCapabilities(env: Env): WebdriverIO.Capabilities {
  return {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': env.ANDROID_DEVICE_NAME,
    ...(env.ANDROID_PLATFORM_VERSION && { 'appium:platformVersion': env.ANDROID_PLATFORM_VERSION }),
    'appium:app': env.APP_ANDROID ?? path.join(APPS_DIR, APP_FILES.android),
    // React Native apps start on a splash activity; accept whatever comes up.
    'appium:appWaitActivity': '*',
    'appium:appWaitForLaunch': true,
    'appium:autoGrantPermissions': true,
    'appium:disableWindowAnimation': true,
    'appium:newCommandTimeout': 240,
    // Generous timeouts for cold emulators on shared CI runners.
    'appium:adbExecTimeout': 60_000,
    'appium:uiautomator2ServerInstallTimeout': 120_000,
    'appium:uiautomator2ServerLaunchTimeout': 120_000,
    'appium:androidInstallTimeout': 180_000,
  };
}
