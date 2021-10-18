import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service auth;

  get showLogin() {
    return this.auth.showBrandedLogin;
  }

  @action
  onHideLogin() {
    this.auth.hideBrandedLogin();
  }
}
