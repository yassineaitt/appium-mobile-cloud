import 'dotenv/config';
import path from 'node:path';
import { z } from 'zod';

const optional = z
  .string()
  .optional()
  .transform((v) => (v === undefined || v.trim() === '' ? undefined : v.trim()));

/**
 * One validated view of the environment. Every profile reads from here, so a typo
 * (PLATFORM=andriod) fails before Appium starts rather than after a 2-minute boot.
 */
export const EnvSchema = z.object({
  PLATFORM: z.enum(['android', 'ios']).default('android'),
  CLOUD: z.enum(['local', 'sauce', 'browserstack']).default('local'),
  BUILD_NAME: optional,
  CI: optional,
  GITHUB_RUN_ID: optional,
  GITHUB_SHA: optional,

  ANDROID_DEVICE_NAME: z.string().default('Android Emulator'),
  ANDROID_PLATFORM_VERSION: optional,
  IOS_DEVICE_NAME: z.string().default('iPhone 16'),
  IOS_PLATFORM_VERSION: optional,
  APP_ANDROID: optional,
  APP_IOS: optional,
  APPIUM_PORT: z.coerce.number().int().positive().default(4723),

  SAUCE_USERNAME: optional,
  SAUCE_ACCESS_KEY: optional,
  SAUCE_REGION: z.enum(['us-west-1', 'eu-central-1']).default('us-west-1'),
  SAUCE_ANDROID_DEVICE: z.string().default('Google Pixel.*'),
  SAUCE_IOS_DEVICE: z.string().default('iPhone.*'),
  SAUCE_ANDROID_APP: z.string().default('storage:filename=android.wdio.native.app.v2.2.0.apk'),
  SAUCE_IOS_APP: z.string().default('storage:filename=ios.real.wdio.native.app.ipa'),

  BROWSERSTACK_USERNAME: optional,
  BROWSERSTACK_ACCESS_KEY: optional,
  BROWSERSTACK_ANDROID_DEVICE: z.string().default('Google Pixel 8'),
  BROWSERSTACK_ANDROID_OS: z.string().default('14.0'),
  BROWSERSTACK_IOS_DEVICE: z.string().default('iPhone 15'),
  BROWSERSTACK_IOS_OS: z.string().default('17'),
  BROWSERSTACK_ANDROID_APP: optional,
  BROWSERSTACK_IOS_APP: optional,
});

export type Env = z.infer<typeof EnvSchema>;

export const ROOT_DIR = path.resolve(import.meta.dirname, '..');
export const APPS_DIR = path.join(ROOT_DIR, 'apps');
export const REPORTS_DIR = path.join(ROOT_DIR, 'reports');

export const APP_FILES = {
  android: 'android.wdio.native.app.v2.2.0.apk',
  ios: 'wdiodemoapp.app',
} as const;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  return EnvSchema.parse(source);
}

/** Human-readable build label shared by all clouds and the JUnit output. */
export function buildName(env: Env): string {
  if (env.BUILD_NAME) return env.BUILD_NAME;
  if (env.GITHUB_RUN_ID) return `ci-${env.GITHUB_RUN_ID}-${(env.GITHUB_SHA ?? '').slice(0, 7)}`;
  return `local-${new Date().toISOString().replace(/[:.]/g, '-')}`;
}

export const env: Env = loadEnv();
