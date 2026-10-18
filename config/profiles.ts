import type { Options, Services } from '@wdio/types';
import { androidLocalCapabilities } from './capabilities/android.local';
import { iosLocalCapabilities } from './capabilities/ios.local';
import { sauceCapabilities, sauceHost } from './capabilities/sauce';
import { BROWSERSTACK_HOST, browserstackCapabilities } from './capabilities/browserstack';
import { REPORTS_DIR } from './env';
import type { Env } from './env';

export interface Profile {
  name: string;
  capabilities: WebdriverIO.Capabilities[];
  connection: Partial<
    Pick<Options.WebdriverIO, 'hostname' | 'port' | 'path' | 'protocol' | 'user' | 'key'>
  >;
  services: Services.ServiceEntry[];
}

/**
 * Turns PLATFORM + CLOUD into a complete WebdriverIO profile: capabilities, where the
 * Appium server is, and which services start. This is the only place that knows about
 * all three clouds; everything else is cloud-agnostic.
 */
export function resolveProfile(env: Env): Profile {
  switch (env.CLOUD) {
    case 'local':
      return {
        name: `local-${env.PLATFORM}`,
        capabilities: [
          env.PLATFORM === 'ios' ? iosLocalCapabilities(env) : androidLocalCapabilities(env),
        ],
        connection: { hostname: '127.0.0.1', port: env.APPIUM_PORT, path: '/' },
        services: [
          [
            'appium',
            {
              command: 'appium',
              args: {
                port: env.APPIUM_PORT,
                relaxedSecurity: true,
                log: `${REPORTS_DIR}/appium-${env.PLATFORM}.log`,
                logTimestamp: true,
                localTimezone: true,
              },
            },
          ],
        ],
      };

    case 'sauce':
      requireVars(env, ['SAUCE_USERNAME', 'SAUCE_ACCESS_KEY']);
      return {
        name: `sauce-${env.PLATFORM}`,
        capabilities: [sauceCapabilities(env)],
        connection: {
          ...sauceHost(env),
          protocol: 'https',
          user: env.SAUCE_USERNAME,
          key: env.SAUCE_ACCESS_KEY,
        },
        services: [['sauce', { region: env.SAUCE_REGION === 'eu-central-1' ? 'eu' : 'us' }]],
      };

    case 'browserstack':
      requireVars(env, ['BROWSERSTACK_USERNAME', 'BROWSERSTACK_ACCESS_KEY']);
      return {
        name: `browserstack-${env.PLATFORM}`,
        capabilities: [browserstackCapabilities(env)],
        connection: {
          ...BROWSERSTACK_HOST,
          protocol: 'https',
          user: env.BROWSERSTACK_USERNAME,
          key: env.BROWSERSTACK_ACCESS_KEY,
        },
        services: [],
      };
  }
}

function requireVars(env: Env, keys: (keyof Env)[]): void {
  const missing = keys.filter((k) => !env[k]);
  if (missing.length > 0) {
    throw new Error(
      `CLOUD=${env.CLOUD} requires ${missing.join(', ')}. Set them in .env or as CI secrets (see .env.example).`,
    );
  }
}
