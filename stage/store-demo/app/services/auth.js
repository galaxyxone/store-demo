import Service, { inject as service } from '@ember/service';
import ENV from 'store-demo/config/environment';

export default class AuthService extends Service {
  @service bitski;
  @service firebase;
  brandedLogin = ENV.brandedLogin;

  get showBrandedLogin() {
    if (this.brandedLogin) {
      return this.firebase.isLoggingIn;
    } else {
      return false;
    }
  }

  hideBrandedLogin() {
    if (this.brandedLogin) {
      return this.firebase.cancelLogIn();
    }
  }

  async initialize() {
    if (this.brandedLogin) {
      return this.firebase.initialize();
    } else {
      return this.bitski.initialize();
    }
  }

  get isLoggedIn() {
    if (this.brandedLogin) {
      return this.firebase.isLoggedIn;
    } else {
      return this.bitski.isLoggedIn;
    }
  }

  async logIn() {
    if (this.brandedLogin) {
      return this.firebase.logIn();
    } else {
      return this.bitski.logIn();
    }
  }

  logOut() {
    if (this.brandedLogin) {
      return this.firebase.logOut();
    } else {
      return this.bitski.logOut();
    }
  }

  async getSignedInUser() {
    if (this.brandedLogin) {
      return this.firebase.getSignedInUser();
    } else {
      return this.bitski.getSignedInUser();
    }
  }
}
