import { describe, expect, it } from 'vitest';
import { buildName, loadEnv } from '@config/env';
import { resolveProfile } from '@config/profiles';

const base = { PATH: '/usr/bin' } as NodeJS.ProcessEnv;

describe('loadEnv', () => {
  it('defaults to local Android', () => {
    const env = loadEnv(base);
    expect(env.PLATFORM).toBe('android');
    expect(env.CLOUD).toBe('local');
    expect(env.APPIUM_PORT).toBe(4723);
  });

  it('rejects unknown platforms before anything starts', () => {
    expect(() => loadEnv({ ...base, PLATFORM: 'andriod' })).toThrow(/PLATFORM/);
  });

  it('treats blank secrets as unset', () => {
    const env = loadEnv({ ...base, SAUCE_USERNAME: '   ' });
    expect(env.SAUCE_USERNAME).toBeUndefined();
  });
});

describe('buildName', () => {
  it('prefers an explicit BUILD_NAME', () => {
    expect(buildName(loadEnv({ ...base, BUILD_NAME: 'release-1', GITHUB_RUN_ID: '9' }))).toBe(
      'release-1',
    );
  });
  it('derives a CI name from the run id and short sha', () => {
    expect(buildName(loadEnv({ ...base, GITHUB_RUN_ID: '42', GITHUB_SHA: 'abcdef0123456' }))).toBe(
      'ci-42-abcdef0',
    );
  });
  it('falls back to a timestamped local name', () => {
    expect(buildName(loadEnv(base))).toMatch(/^local-\d{4}-/);
  });
});

describe('resolveProfile', () => {
  it('local android starts an Appium service on the configured port', () => {
    const p = resolveProfile(loadEnv({ ...base, APPIUM_PORT: '4800' }));
    expect(p.name).toBe('local-android');
    expect(p.connection.port).toBe(4800);
    expect(p.services[0]).toMatchObject(['appium', { args: { port: 4800 } }]);
    expect(p.capabilities[0]).toMatchObject({
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
    });
  });

  it('local ios uses XCUITest and the extracted .app bundle', () => {
    const p = resolveProfile(loadEnv({ ...base, PLATFORM: 'ios' }));
    expect(p.capabilities[0]).toMatchObject({
      platformName: 'iOS',
      'appium:automationName': 'XCUITest',
    });
    expect(p.capabilities[0]?.['appium:app']).toMatch(/wdiodemoapp\.app$/);
  });

  it('sauce fails fast without credentials', () => {
    expect(() => resolveProfile(loadEnv({ ...base, CLOUD: 'sauce' }))).toThrow(
      /SAUCE_USERNAME, SAUCE_ACCESS_KEY/,
    );
  });

  it('sauce targets the regional endpoint and the sauce service', () => {
    const p = resolveProfile(
      loadEnv({
        ...base,
        CLOUD: 'sauce',
        SAUCE_USERNAME: 'u',
        SAUCE_ACCESS_KEY: 'k',
        SAUCE_REGION: 'eu-central-1',
      }),
    );
    expect(p.connection.hostname).toBe('ondemand.eu-central-1.saucelabs.com');
    expect(p.services[0]).toMatchObject(['sauce', { region: 'eu' }]);
    expect(p.capabilities[0]).toMatchObject({ 'sauce:options': { appiumVersion: 'latest' } });
  });

  it('browserstack requires an uploaded app reference', () => {
    expect(() =>
      resolveProfile(
        loadEnv({
          ...base,
          CLOUD: 'browserstack',
          BROWSERSTACK_USERNAME: 'u',
          BROWSERSTACK_ACCESS_KEY: 'k',
        }),
      ),
    ).toThrow(/BROWSERSTACK_ANDROID_APP/);
  });

  it('browserstack ios profile carries device and os into bstack:options', () => {
    const p = resolveProfile(
      loadEnv({
        ...base,
        CLOUD: 'browserstack',
        PLATFORM: 'ios',
        BROWSERSTACK_USERNAME: 'u',
        BROWSERSTACK_ACCESS_KEY: 'k',
        BROWSERSTACK_IOS_APP: 'bs://abc',
        BROWSERSTACK_IOS_DEVICE: 'iPhone 15 Pro',
        BROWSERSTACK_IOS_OS: '17',
      }),
    );
    expect(p.connection.hostname).toBe('hub.browserstack.com');
    expect(p.capabilities[0]).toMatchObject({
      'appium:app': 'bs://abc',
      'bstack:options': { deviceName: 'iPhone 15 Pro', osVersion: '17' },
    });
  });

  it('never leaks credentials into capabilities', () => {
    const p = resolveProfile(
      loadEnv({ ...base, CLOUD: 'sauce', SAUCE_USERNAME: 'alice', SAUCE_ACCESS_KEY: 'topsecret' }),
    );
    expect(JSON.stringify(p.capabilities)).not.toContain('topsecret');
  });
});
