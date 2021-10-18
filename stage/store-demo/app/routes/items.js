import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ItemsRoute extends Route {
  @service auth;
  @service opensea;

  model() {
    return this.auth.getSignedInUser().then(user => {
      let ethAccount = user.accounts[0];
      return this.opensea.getAssets(ethAccount);
    }).catch(() => this.transitionTo('index'));
  }
}
