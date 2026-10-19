import fs from 'node:fs';
import path from 'node:path';

import { env, REPORTS_DIR, ROOT_DIR, buildName } from './env';
import { resolveProfile } from './profiles';
import { dismissSystemDialogs } from '../src/utils/system-dialogs';

const profile = resolveProfile(env);
const junitDir = path.join(REPORTS_DIR, 'junit');
const screenshotDir = path.join(REPORTS_DIR, 'screenshots');
fs.mkdirSync(junitDir, { recursive: true });
fs.mkdirSync(screenshotDir, { recursive: true });

// Appium drivers live inside the repo so `npm run appium:setup` is reproducible.
process.env.APPIUM_HOME ??= path.join(ROOT_DIR, '.appium');

export const config: WebdriverIO.Config = {
  runner: 'local',
  tsConfigPath: path.join(ROOT_DIR, 'tsconfig.json'),

  specs: ['../tests/specs/**/*.spec.ts'],
  maxInstances: 1,
  capabilities: profile.capabilities,
  ...profile.connection,
  services: profile.services,

  logLevel: 'info',
  outputDir: path.join(REPORTS_DIR, 'wdio-logs'),
  bail: 0,
  waitforTimeout: 15_000,
  connectionRetryTimeout: 300_000,
  connectionRetryCount: 2,
  specFileRetries: env.CI ? 1 : 0,
  specFileRetriesDeferred: true,

  framework: 'mocha',
  mochaOpts: { ui: 'bdd', timeout: 180_000 },
  reporters: [
    'spec',
    [
      'junit',
      {
        outputDir: junitDir,
        outputFileFormat: (opts: { cid: string }) => `${profile.name}-${opts.cid}.xml`,
        suiteNameFormat: /[^a-zA-Z0-9@ ]+/,
        addFileAttribute: true,
      },
    ],
  ],

  onPrepare() {
    console.info(`▶ profile=${profile.name} build=${buildName(env)}`);
  },

  async before() {
    await dismissSystemDialogs();
  },

  async beforeTest() {
    await dismissSystemDialogs();
  },

  async afterTest(test, _context, { passed }) {
    if (!passed) {
      const file = `${profile.name}-${test.parent}-${test.title}`.replace(/[^\w@-]+/g, '_');
      await browser.saveScreenshot(path.join(screenshotDir, `${file}.png`));
    }
    if (env.CLOUD === 'browserstack') {
      // BrowserStack has no service plugin here; mark the session via its executor API.
      const status = passed ? 'passed' : 'failed';
      await browser.executeScript(
        `browserstack_executor: ${JSON.stringify({ action: 'setSessionStatus', arguments: { status, reason: test.title } })}`,
        [],
      );
    }
  },

  async afterSession() {
    // Nothing to tear down for local; cloud sessions close with the driver.
  },
};
