import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { AuthenticationStatus, Bitski } from 'bitski';
import ENV from 'store-demo/config/environment';

export default class BitskiService extends Service {
  @tracked isLoggedIn;

  initialize() {
    this._bitski = new Bitski(ENV.bitskiClientId, window.location.origin + '/redirect-callback');
    this.isLoggedIn = this._bitski.authStatus !== AuthenticationStatus.NotConnected;

    return Promise.resolve(this.isLoggedIn);
  }

  async logIn() {
    let user = await this._bitski.signIn();
    this.isLoggedIn = true;

    if (user.accounts && user.accounts.length > 0) {
      return user;
    } else {
      // Sessions do not always include accounts, e.g. newly created user accounts.
      let accounts = await this._bitski
        .getProvider({ disableBlockTracking: true })
        .send('eth_accounts', []);
      user.accounts = accounts;
      this._bitski.authProvider.userStore.set(user);
      return user;
    }
  }

  logOut() {
    return this._bitski.signOut().then(() => this.isLoggedIn = false);
  }

  getSignedInUser() {
    if (this.isLoggedIn) {
      return this._bitski.getUser();
    } else {
      return this.logIn();
    }
  }
}
