import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | checkout-form', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('myProperty', {});

    await render(hbs`<CheckoutForm @item={{myProperty}}/>`);

    assert.ok(this.element.textContent.trim().includes('Card Number'), 'Renders form');
  });
});
