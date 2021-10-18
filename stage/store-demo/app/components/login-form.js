import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class LoginFormComponent extends Component {
  @service firebase;

  get isProcessingWallet() {
    return this.firebase.isProcessingWallet;
  }

  @action
  didInsert() {
    this.firebase.addLoginUi();
  }
}
