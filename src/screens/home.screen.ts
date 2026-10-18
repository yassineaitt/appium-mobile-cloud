import { BaseScreen } from './base.screen';

class HomeScreen extends BaseScreen {
  constructor() {
    super('Home-screen');
  }
}

export const homeScreen = new HomeScreen();
