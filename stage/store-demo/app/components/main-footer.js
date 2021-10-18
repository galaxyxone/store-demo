import Component from '@glimmer/component';

export default class MainFooterComponent extends Component {
  get year() {
    let date = new Date();
    return date.getFullYear();
  }
}
