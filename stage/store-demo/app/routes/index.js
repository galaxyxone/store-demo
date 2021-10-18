import Route from '@ember/routing/route';

export default class IndexRoute extends Route {
  model() {
    return fetch('/inventory/tokens.json').then(res => res.json());
  }
}
