import './post-reactions.css';
import BaseComponent from '../../../../../components/base-component/base-component';
import Picture from '../../../../../components/base-component/picture/picture';
import Svg from '../../../../../components/base-component/svg/svg';
import SvgNames from '../../../../../components/base-component/svg/svg.types';
import { ProjectColors } from '../../../../../utils/consts';
import { Kudo } from '../../../../../app/loader/loader-responses.types';
import { checkDataInLocalStorage } from '../../../../../utils/local-storage';

export default class PostReactions extends BaseComponent<'div'> {
  private counterWrapper: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.element,
    'post-reactions__counter-wrapper',
  );

  private avatarsWrapper: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.counterWrapper.element,
    'post-reactions__counter-avatars',
  );

  private frontAvatar: Picture | null = null;

  private middleAvatar: Picture | null = null;

  private backAvatar: Picture | null = null;

  private likesNumber: BaseComponent<'span'> = new BaseComponent(
    'span',
    this.counterWrapper.element,
    'post-reactions__likes-number',
  );

  private svgButtonsWrapper: BaseComponent<'div'> = new BaseComponent(
    'div',
    this.element,
    'post-reactions__svg-wrapper',
  );

  public like: Svg = new Svg(
    this.svgButtonsWrapper.element,
    SvgNames.Like,
    ProjectColors.LightTurquoise,
    'post-reaction__reaction-svg post-reaction__reaction-like',
  );

  public comment: Svg = new Svg(
    this.svgButtonsWrapper.element,
    SvgNames.Comment,
    ProjectColors.LightTurquoise,
    'post-reaction__reaction-svg post-reaction__reaction-comment',
  );

  private avatarsLimit: number = 3;

  public likesCounter: number = 0;

  public shownAvatarsNumber: number = 0;

  public kudos: Kudo[] = [];

  private userId: string | null = checkDataInLocalStorage('MyStriversId');

  constructor(parent: HTMLElement) {
    super('div', parent, 'post-reactions');
  }

  public renderUsersAvatars(): void {
    if (this.avatarsWrapper.element.children.length > 0) {
      const childrenArray: Element[] = Array.from(this.avatarsWrapper.element.children);
      childrenArray.forEach((child) => this.avatarsWrapper.element.removeChild(child));
    }
    const sortedLikes: Kudo[] = PostReactions.sortLikesByDate(this.kudos).reverse();
    // eslint-disable-next-line max-len
    this.shownAvatarsNumber = sortedLikes.length > this.avatarsLimit ? this.avatarsLimit : sortedLikes.length;
    const avatars = this.createAvatarElements(this.shownAvatarsNumber);

    let index: number = 0;
    while (index < this.shownAvatarsNumber) {
      avatars[index].element.src = sortedLikes[index].avatarUrl;
      index += 1;
    }

    this.adjustStyles();
  }

  public updateLikesNumber(): void {
    if (this.likesCounter > 0) {
      this.likesNumber.element.textContent = `${this.likesCounter} kudos`;
    } else {
      this.likesNumber.element.textContent = '';
    }
  }

  public updateAvatarsForKudos(avatarSrc: string, isLiked: boolean): void {
    if (isLiked === true && this.userId) {
      const userLikeData: Kudo = {
        userId: this.userId,
        avatarUrl: avatarSrc,
        createdAt: new Date().toISOString(),
      };
      this.kudos.push(userLikeData);
    } else if (isLiked === false && this.userId) {
      this.kudos = this.kudos.filter((kudo) => kudo.userId !== this.userId);
    }
    this.renderUsersAvatars();
  }

  private createAvatarElements(numberOfAvatars: number): Picture[] {
    const avatars: Picture[] = [];

    if (numberOfAvatars > 0 && numberOfAvatars <= 3) {
      this.frontAvatar = new Picture(
        this.avatarsWrapper.element,
        'post-reactions__avatar post-reactions__avatar-front',
      );
      avatars.push(this.frontAvatar);
    }

    if (numberOfAvatars >= 2 && numberOfAvatars <= 3 && this.frontAvatar) {
      this.middleAvatar = new Picture(
        this.avatarsWrapper.element,
        'post-reactions__avatar post-reactions__avatar-middle',
      );
      avatars.push(this.middleAvatar);
    }

    if (numberOfAvatars === 3 && this.frontAvatar && this.middleAvatar) {
      this.backAvatar = new Picture(this.avatarsWrapper.element, 'post-reactions__avatar post-reactions__avatar-back');

      avatars.push(this.backAvatar);
    }

    return avatars;
  }

  private adjustStyles(): void {
    if (this.shownAvatarsNumber === 2) {
      this.likesNumber.element.style.transform = 'translateX(-25%)';
    } else if (this.shownAvatarsNumber === 3) {
      this.likesNumber.element.style.transform = 'translateX(-45%)';
    } else {
      this.likesNumber.element.style.transform = '';
    }
  }

  private static sortLikesByDate(likes: Kudo[]): Kudo[] {
    const likesToSort: Kudo[] = [...likes];
    // eslint-disable-next-line max-len
    return likesToSort.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
}
