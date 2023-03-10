/* eslint-disable arrow-body-style */
/* eslint-disable max-len */
import './challenges.css';
import BaseComponent from '../../components/base-component/base-component';
import ActivityBlock from './activity-element/activity-element';
import SvgNames from '../../components/base-component/svg/svg.types';
import { checkDataInLocalStorage } from '../../utils/local-storage';
import { Token } from '../../app/loader/loader-requests.types';
import { FriendData, User } from '../../app/loader/loader-responses.types';
import Challenge from './challenge/challenge';
import { getUser, updateUser } from '../../app/loader/services/user-services';
import { Activities, ChallengesTypes } from './types-challenges';
import LoadingTimer from '../../components/base-component/loading/loading';

export default class Challenges extends BaseComponent<'section'> {
  private dictionary: Record<string, string> = {
    title: 'challenges.title',
    typeAll: 'challenges.typeAll',
    typeRunning: 'challenges.typeRunning',
    typeCycling: 'challenges.typeCycling',
    typeHiking: 'challenges.typeHiking',
    typeWalking: 'challenges.typeWalking',
    hikingTitle: 'challenges.hikingTitle',
    hikingDescription: 'challenges.hikingDescription',
    slothTitle: 'challenges.slothTitle',
    slothDescription: 'challenges.slothDescription',
    cyclingTitle: 'challenges.cyclingTitle',
    cyclingDescription: 'challenges.cyclingDescription',
    runningTitle: 'challenges.runningTitle',
    runningDescription: 'challenges.runningDescription',
    photoTitle: 'challenges.photoTitle',
    photoDescription: 'challenges.photoDescription',
    yogaTitle: 'challenges.yogaTitle',
    yogaDescription: 'challenges.yogaDescription',
  };

  private token: Token | null = checkDataInLocalStorage('userSessionToken');

  public usersData!: User;

  public challengesAll: Challenge[] = [];

  private typesAll: ActivityBlock[] = [];

  private resultTypesAll: ActivityBlock[] = [];

  private hikingChallenge!: Challenge;

  private slothChallenge!: Challenge;

  private cyclingChallenge!: Challenge;

  private runningChallenge!: Challenge;

  private photoChallenge!: Challenge;

  private yogaChallenge!: Challenge;

  private challenges: string[] = [];

  private challengesForRequest: string[] = [];

  private formContainer!: BaseComponent<'div'>;

  private titleWrapper!: BaseComponent<'div'>;

  private challengeTitle!: BaseComponent<'h2'>;

  private typeOfChallenge!: BaseComponent<'div'>;

  private allTypes!: ActivityBlock;

  private running!: ActivityBlock;

  private cycling!: ActivityBlock;

  private hiking!: ActivityBlock;

  private walking!: ActivityBlock;

  private challengesBlock!: BaseComponent<'div'>;

  public loadingTimer = new LoadingTimer(document.body);

  constructor(parent: HTMLElement) {
    super('section', parent, 'challenges challenges-section');
    this.init();
  }

  private init(): void {
    this.loadingTimer.showLoadingCircle();
    setTimeout(() => {
      this.getFriendsRequest();
      this.loadingTimer.deleteLoadingCircle();
    }, 3000);
  }

  private getFriendsRequest(): void {
    if (this.token) {
      getUser(this.token).then((user: User): void => {
        this.usersData = user;
        if (user.challenges && user.challenges.length) {
          this.challenges = user.challenges;
        }
        this.renderPage(this.usersData.following);
        this.addListeners();
      });
    }
  }

  private renderPage(data: FriendData[]): void {
    this.renderTypes();
    this.renderFirstChallenges(data);
    this.renderSecondChallenges(data);
    this.challengesAll = [
      this.hikingChallenge,
      this.slothChallenge,
      this.cyclingChallenge,
      this.runningChallenge,
      this.photoChallenge,
      this.yogaChallenge,
    ];
    this.typesAll = [this.allTypes, this.cycling, this.running, this.walking, this.hiking];
    this.isAddedForChallenges();
  }

  // eslint-disable-next-line max-lines-per-function
  private renderTypes(): void {
    this.formContainer = new BaseComponent('div', this.element, 'challenges__container');
    this.titleWrapper = new BaseComponent('div', this.formContainer.element, 'challenges__title-wrapper');
    this.challengeTitle = new BaseComponent(
      'h2',
      this.titleWrapper.element,
      'challenges__title titles',
      this.dictionary.title,
    );
    this.typeOfChallenge = new BaseComponent('div', this.titleWrapper.element, 'challenges__types-block');
    this.allTypes = new ActivityBlock(
      this.typeOfChallenge.element,
      SvgNames.Star,
      this.dictionary.typeAll,
      'challenges__all challenges__activity',
    );
    this.running = new ActivityBlock(
      this.typeOfChallenge.element,
      SvgNames.Running,
      this.dictionary.typeRunning,
      'challenges__running challenges__activity',
    );
    this.cycling = new ActivityBlock(
      this.typeOfChallenge.element,
      SvgNames.Cycling,
      this.dictionary.typeCycling,
      'challenges__cycling challenges__activity',
    );
    this.hiking = new ActivityBlock(
      this.typeOfChallenge.element,
      SvgNames.Hiking,
      this.dictionary.typeHiking,
      'challenges__hiking challenges__activity',
    );
    this.walking = new ActivityBlock(
      this.typeOfChallenge.element,
      SvgNames.Walking,
      this.dictionary.typeWalking,
      'challenges__walking challenges__activity',
    );
  }

  private renderFirstChallenges(data: FriendData[]): void {
    this.challengesBlock = new BaseComponent('div', this.formContainer.element, 'challenges__challenges-block');
    const hikingUsers: string[] = Challenges.checkChallenges(data, ChallengesTypes.Hiking);
    this.hikingChallenge = new Challenge(
      this.challengesBlock.element,
      ChallengesTypes.Hiking,
      [Activities.Hiking, Activities.Walking, Activities.Running, Activities.Cycling],
      hikingUsers,
      this.dictionary.hikingTitle,
      this.dictionary.hikingDescription,
      ['02/01/2023', '02/01/2024'],
      true,
    );

    const slothUsers: string[] = Challenges.checkChallenges(data, ChallengesTypes.Sloth);
    this.slothChallenge = new Challenge(
      this.challengesBlock.element,
      ChallengesTypes.Sloth,
      [Activities.Walking],
      slothUsers,
      this.dictionary.slothTitle,
      this.dictionary.slothDescription,
      ['10/20/2023', '10/20/2023'],
      false,
    );

    const cyclingUsers: string[] = Challenges.checkChallenges(data, ChallengesTypes.Cycling);
    this.cyclingChallenge = new Challenge(
      this.challengesBlock.element,
      ChallengesTypes.Cycling,
      [Activities.Cycling],
      cyclingUsers,
      this.dictionary.cyclingTitle,
      this.dictionary.cyclingDescription,
      ['02/27/2023', '03/06/2023'],
      true,
    );
  }

  private renderSecondChallenges(data: FriendData[]): void {
    const runningUsers: string[] = Challenges.checkChallenges(data, ChallengesTypes.Running);
    this.runningChallenge = new Challenge(
      this.challengesBlock.element,
      ChallengesTypes.Running,
      [Activities.Hiking, Activities.Walking, Activities.Running, Activities.Cycling],
      runningUsers,
      this.dictionary.runningTitle,
      this.dictionary.runningDescription,
      ['02/01/2023', '02/01/2024'],
      true,
    );

    const photoUsers: string[] = Challenges.checkChallenges(data, ChallengesTypes.Photo);
    this.photoChallenge = new Challenge(
      this.challengesBlock.element,
      ChallengesTypes.Photo,
      [Activities.Hiking, Activities.Walking, Activities.Running, Activities.Cycling],
      photoUsers,
      this.dictionary.photoTitle,
      this.dictionary.photoDescription,
      ['02/19/2023', '03/19/2023'],
      false,
    );

    const yogaUsers: string[] = Challenges.checkChallenges(data, ChallengesTypes.Yoga);
    this.yogaChallenge = new Challenge(
      this.challengesBlock.element,
      ChallengesTypes.Yoga,
      [Activities.Hiking, Activities.Walking],
      yogaUsers,
      this.dictionary.yogaTitle,
      this.dictionary.yogaDescription,
      ['02/19/2023', '03/19/2023'],
      true,
    );
  }

  private isAddedForChallenges(): void {
    this.challengesAll.every((challenge: Challenge): Challenge => {
      if (this.challenges.includes(challenge.type)) {
        challenge.setButtonFunction();
      }
      return challenge;
    });
  }

  private static checkChallenges(data: FriendData[], challenge: string): string[] {
    const avatars: string[] = [];
    const filtered: FriendData[] = data.filter((user: FriendData): boolean => user.challenges.includes(challenge));
    filtered.forEach((user: FriendData): void => {
      avatars.push(user.avatarUrl);
    });
    return avatars;
  }

  private addListeners(): void {
    this.typesAll.forEach((type: ActivityBlock): void => {
      type.element.addEventListener('click', (): void => {
        if (this.resultTypesAll.includes(type)) {
          this.resultTypesAll.splice(this.resultTypesAll.indexOf(type), 1);
        } else {
          this.resultTypesAll.push(type);
        }
        this.showVisibleChallenges();
      });
    });
    this.challengesAll.forEach((challenge: Challenge): void => {
      challenge.button.element.addEventListener('click', (): void => {
        const { type }: Challenge = challenge;
        if (this.challenges.includes(type)) {
          this.challenges.splice(this.challenges.indexOf(type), 1);
        } else {
          this.challenges.push(type);
        }
        this.sendChallenges(this.challenges);
      });
    });
  }

  private sendChallenges(data: string[]): void {
    if (this.token) {
      updateUser(this.token, { challenges: data.length === 0 ? [] : data });
    }
  }

  private filterCards(): Challenge[] {
    return this.challengesAll.filter((challenge: Challenge): boolean => {
      return challenge.allTypes.some((typeInChallenge: string): boolean => {
        return this.resultTypesAll.some((type: ActivityBlock): boolean => {
          if (type.challengeName === 'all' || type.challengeName === '?????? ????????') {
            return true;
          }
          return type.challengeName.includes(typeInChallenge);
        });
      });
    });
  }

  private showVisibleChallenges(): void {
    this.doVisibleChallenge();
    this.hiddenChallenge();

    const visibleChallenges: Challenge[] = this.filterCards();
    if (visibleChallenges.length) {
      this.challengesAll.forEach((challenge: Challenge): void => {
        visibleChallenges.forEach((visible: Challenge): void => {
          if (challenge === visible) {
            challenge.element.classList.remove('hidden');
          }
        });
      });
    } else {
      this.doVisibleChallenge();
    }
  }

  private hiddenChallenge(): void {
    this.challengesAll.forEach((challenge: Challenge): void => challenge.element.classList.add('hidden'));
  }

  private doVisibleChallenge(): void {
    this.challengesAll.forEach((challenge: Challenge): void => challenge.element.classList.remove('hidden'));
  }
}
