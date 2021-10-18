import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import ENV from 'store-demo/config/environment';

export default class MainNavbarComponent extends Component {
  @service auth;
  @service router;
  @tracked expanded = false;

  get isLoggedIn() {
    return this.auth.isLoggedIn;
  }

  get brandedLogin() {
    return ENV.brandedLogin;
  }

  @action
  toggleExpanded() {
    this.expanded = !this.expanded;
  }

  @action
  logIn() {
    this.auth.logIn();
  }

  @action
  logOut() {
    this.router.transitionTo('index');
    this.auth.logOut();
  }
}
