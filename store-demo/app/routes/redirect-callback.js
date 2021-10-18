import Route from '@ember/routing/route';
import { Bitski } from 'bitski';

export default class RedirectCallbackRoute extends Route {
  model() {
    // Sends a message to the parent window with the access token and dismisses the popup
    Bitski.callback();
  }
}
