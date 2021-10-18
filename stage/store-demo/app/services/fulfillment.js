import Service from '@ember/service';

export default class FulfillmentService extends Service {
  async processPurchase(token, productId, recipient) {
    let response = await fetch('/process-transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, productId, recipient })
    });
    let json = await response.json();

    if (response.ok) {
      return json;
    }
    return this.parseError(json);
  }

  parseError(response) {
    if (response && response.error && response.error.message) {
      throw new Error(response.error.message);
    } else {
      throw new Error('Something went wrong. Unknown error.');
    }
  }
}
