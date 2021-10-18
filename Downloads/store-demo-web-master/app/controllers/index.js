import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { later } from '@ember/runloop';
import ENV from 'store-demo/config/environment';

const NEXT_BLOCK_DELAY = 2000;
const COMPLETE_NOTICE_TIMEOUT = 5000;

export default class IndexController extends Controller {
  @tracked selectedItem;
  @tracked showCheckoutForm = false;
  @tracked showProcessing = false;
  @tracked showComplete = false;
  @tracked fadeOutComplete = false;

  get brandedLogin() {
    return ENV.brandedLogin;
  }

  @action
  onShowCheckoutForm(item) {
    this.selectedItem = item;
    this.showCheckoutForm = true;
  }

  @action
  onHideCheckoutForm() {
    this.selectedItem = null;
    this.showCheckoutForm = false;
  }

  @action
  onProcessing() {
    this.showProcessing = true;
    this.showCheckoutForm = false;
  }

  @action
  onComplete() {
    // Wait for blockchain confirmation
    later(this, () => {
      this.showComplete = true;
    }, NEXT_BLOCK_DELAY);

    // Fade out complete notice after timeout
    later(this, () => {
      this.fadeOutComplete = true;
    }, COMPLETE_NOTICE_TIMEOUT);

    // Reset for next purchase
    later(this, () => {
      this.showProcessing = false;
      this.showComplete = false;
      this.fadeOutComplete = false;
    }, COMPLETE_NOTICE_TIMEOUT + 500);
  }
}
