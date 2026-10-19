import { byId, firstText } from '@utils/selectors';
import { hideKeyboard } from '@utils/keyboard';
import { BaseScreen } from './base.screen';

interface Credentials {
  email: string;
  password: string;
}

class LoginScreen extends BaseScreen {
  constructor() {
    super('Login-screen');
  }

  get loginTab(): ChainablePromiseElement {
    return $(byId('button-login-container'));
  }
  get signUpTab(): ChainablePromiseElement {
    return $(byId('button-sign-up-container'));
  }
  get email(): ChainablePromiseElement {
    return $(byId('input-email'));
  }
  get password(): ChainablePromiseElement {
    return $(byId('input-password'));
  }
  get repeatPassword(): ChainablePromiseElement {
    return $(byId('input-repeat-password'));
  }
  get loginButton(): ChainablePromiseElement {
    return $(byId('button-LOGIN'));
  }
  get signUpButton(): ChainablePromiseElement {
    return $(byId('button-SIGN UP'));
  }

  validationMessage(text: string): ChainablePromiseElement {
    return firstText(text);
  }

  async login({ email, password }: Credentials): Promise<void> {
    await this.loginTab.click();
    await this.email.setValue(email);
    await this.password.setValue(password);
    await hideKeyboard();
    await this.loginButton.click();
  }

  async signUp({ email, password }: Credentials, repeat = password): Promise<void> {
    await this.signUpTab.click();
    await this.email.setValue(email);
    await this.password.setValue(password);
    await this.repeatPassword.setValue(repeat);
    await hideKeyboard();
    await this.signUpButton.click();
  }
}

export const loginScreen = new LoginScreen();
