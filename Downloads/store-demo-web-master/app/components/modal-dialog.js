import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ModalDialogComponent extends Component {
  innerClicked = false;

  @action
  innerClick() {
    // Mark that inner modal was clicked to prevent `allClicks` from closing in this case.
    this.innerClicked = true;
  }

  @action
  allClicks() {
    if (!this.innerClicked && this.args.onClose) {
      this.args.onClose();
    }
    this.innerClicked = false;
  }

  @action
  onClose() {
    if (this.args.onClose) {
      this.args.onClose();
    }
  }

}
