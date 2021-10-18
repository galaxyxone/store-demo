import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | redirect-callback', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:redirect-callback');
    assert.ok(route);
  });
});
