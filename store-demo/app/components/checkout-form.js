import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import ENV from 'store-demo/config/environment';

export default class CheckoutFormComponent extends Component {
  @service auth;
  @service fulfillment;
  @tracked cardComplete;
  @tracked isSubmitting;
  @tracked error;

  card = null;
  stripe = Stripe(ENV.stripeKey);
  style = {
    base: {
      color: '#444a57',
      fontFamily: 'sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#6c757d'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  };

  get formattedPrice() {
    return (this.args.item.price / 100).toFixed(2);
  }

  get submitDisabled() {
    return !this.cardComplete || this.isSubmitting;
  }

  @action
  submit(evt) {
    this.error = null;
    this.isSubmitting = true;
    evt.preventDefault();

    this.stripe.createToken(this.card).then((result) => {
      if (result.error) {
        this.error = result.error.message;
        this.isSubmitting = false;
      } else {
        this.auth.getSignedInUser()
          .then(user => {
            return this.fulfillment.processPurchase(result.token, this.args.item.productId, user.accounts[0]);
          })
          .then(() => {
            this.args.onProcessing();
            this.args.onComplete();
          })
          .catch(err => {
            if (err && err.message !== 'Sign in request was cancelled.') {
              this.error = err.message;
            }
          });
      }
    }).catch(err => this.error = err.message).finally(() => this.isSubmitting = false);
  }

  @action
  didInsert() {
    let elements = this.stripe.elements();
    this.card = elements.create('card', { style: this.style });
    this.card.mount('#card-element');
    this.card.addEventListener('change', (event) => {
      if (event.error) {
        this.error = event.error.message;
      } else {
        this.cardComplete = event.complete;
        this.error = null;
      }
    });
  }
}
