import { loginScreen } from '@screens/login.screen';
import { nativeAlert } from '@screens/components/native-alert.component';
import { tabBar } from '@screens/components/tab-bar.component';
import { messages, users } from '@data/users';

describe('Login form', () => {
  beforeEach(async () => {
    await tabBar.open('Login');
    await loginScreen.waitForIsShown();
  });

  it('logs in with valid credentials @smoke', async () => {
    await loginScreen.login(users.valid);

    await nativeAlert.waitForIsShown();
    await expect(nativeAlert.text()).resolves.toContain(messages.loggedIn);
    await nativeAlert.accept();
    await nativeAlert.waitForIsShown(false);
  });

  it('rejects an invalid email address @regression', async () => {
    await loginScreen.login(users.invalidEmail);

    await expect(loginScreen.validationMessage(messages.invalidEmail)).toBeDisplayed();
    await expect(nativeAlert.isShown()).resolves.toBe(false);
  });

  it('rejects a password shorter than 8 characters @regression', async () => {
    await loginScreen.login(users.shortPassword);

    await expect(loginScreen.validationMessage(messages.shortPassword)).toBeDisplayed();
  });

  it('signs up when both passwords match @regression', async () => {
    await loginScreen.signUp(users.valid);

    await nativeAlert.waitForIsShown();
    await expect(nativeAlert.text()).resolves.toContain(messages.signedUp);
    await nativeAlert.accept();
  });

  it('blocks sign-up when passwords differ @regression', async () => {
    await loginScreen.signUp(users.valid, 'Different123!');

    await expect(loginScreen.validationMessage(messages.passwordMismatch)).toBeDisplayed();
    await expect(nativeAlert.isShown()).resolves.toBe(false);
  });
});
