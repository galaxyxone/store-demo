import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import ENV from 'store-demo/config/environment';

export default class InventoryItemComponent extends Component {
  @service auth;
  @service stripe;
  @service fulfillment;

  @tracked error;

  get price() {
    if (this.args.item) {
      return (this.args.item.price / 100).toFixed(0);
    } else {
      return '';
    }
  }

  @action
  async buy() {
    this.error = false;
    let { title, productId, price } = this.args.item;

    try {
      let user = await this.auth.getSignedInUser();

      if (ENV.brandedCheckout) {
        // Either show branded checkout form
        this.args.onShowCheckoutForm(this.args.item);
      } else {
        // Or show default Stripe checkout form
        let token = await this.stripe.showCheckoutForm(title, price);
        if (this.args.onProcessing) {
          this.args.onProcessing();
        }

        await this.fulfillment.processPurchase(token, productId, user.accounts[0]);

        if (this.args.onComplete) {
          this.args.onComplete();
        }
      }
    } catch (err) {
      if (err && err.message !== 'Sign in request was cancelled.') {
        this.error = err;
      }
    }
  }
}
