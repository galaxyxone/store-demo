import Service from '@ember/service';
import ENV from 'store-demo/config/environment';

export default class StripeService extends Service {
  buildCheckout(fulfill, reject) {
    return StripeCheckout.configure({
      key: ENV.stripeKey,
      image: ENV.stripeCheckoutImage,
      token: (token) => {
        if (token) {
          fulfill(token);
        } else {
          reject(new Error('Transaction was cancelled'));
        }
      }
    });
  }

  showCheckoutForm(description, amount) {
    return new Promise((fulfill, reject) => {
      this.buildCheckout(fulfill, reject).open({
        name: ENV.siteTitle,
        description,
        amount,
      });
    });
  }
}
