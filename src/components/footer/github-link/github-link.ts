import BaseComponent from '../../base-component/base-component';
import './github-link.css';

export default class GithubLink extends BaseComponent<'a'> {
  constructor(parent: HTMLElement, link: string, text: string) {
    super('a', parent, 'github-link', text, { href: link });
  }
}
