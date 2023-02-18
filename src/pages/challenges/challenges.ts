import './challenges.css';
import BaseComponent from '../../components/base-component/base-component';
import ActivityBlock from './activity-element/activity-element';
import SvgNames from '../../components/base-component/svg/svg.types';
// import Challenge from './challenge/challenge';
import { checkDataInLocalStorage } from '../../utils/local-storage';
import { FriendData, Token } from '../../app/loader/loader.types';
// import { getFriends } from '../../app/loader/services/friends-services';

export default class Challenges extends BaseComponent<'section'> {
  private token: Token | null = checkDataInLocalStorage('userSessionToken');

  public usersData: FriendData[] = [];

  private formContainer = new BaseComponent('div', this.element, 'challenges__container');

  private challengeTitle = new BaseComponent(
    'h2',
    this.formContainer.element,
    'challenges__title titles',
    'Challenges',
  );

  private typeOfChallenge = new BaseComponent('div', this.formContainer.element, 'challenges__types-block');

  private allTypes = new ActivityBlock(
    this.typeOfChallenge.element,
    SvgNames.Star,
    'All',
    'challenges__all challenges__activity',
  );

  private running = new ActivityBlock(
    this.typeOfChallenge.element,
    SvgNames.Running,
    'Running',
    'challenges__running challenges__activity',
  );

  private cycling = new ActivityBlock(
    this.typeOfChallenge.element,
    SvgNames.Cycling,
    'Cycling',
    'challenges__cycling challenges__activity',
  );

  private hiking = new ActivityBlock(
    this.typeOfChallenge.element,
    SvgNames.Hiking,
    'Hiking',
    'challenges__hiking challenges__activity',
  );

  private walking = new ActivityBlock(
    this.typeOfChallenge.element,
    SvgNames.Walking,
    'Walking',
    'challenges__walking challenges__activity',
  );

  private challengesBlock = new BaseComponent('div', this.formContainer.element, 'challenges__challenges-block');

  constructor(parent: HTMLElement) {
    super('section', parent, 'challenges challenges-section');
    // this.getFriendsRequest();
    /* .then((data) => {
      this.renderPage(data);
    }); */
  }

  /*  private getFriendsRequest() {
    if (this.token) {
      getFriends(this.token).then((usersData: FriendData[]): void => {
        this.usersData = usersData;
      });
    }
  } */

  /* private renderPage(data: FriendData[]): void {
    console.log(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const first = new Challenge(this.challengesBlock.element, 'running');
  } */
}
