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
import eventEmitter from '../../utils/event-emitter';
import { Activities, ChallengesTypes } from './types-challenges';

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

  private formContainer = new BaseComponent('div', this.element, 'challenges__container');

  private titleWrapper = new BaseComponent('div', this.formContainer.element, 'challenges__title-wrapper');

  private challengeTitle = new BaseComponent(
    'h2',
    this.titleWrapper.element,
    'challenges__title titles',
    this.dictionary.title,
  );

  private typeOfChallenge = new BaseComponent('div', this.titleWrapper.element, 'challenges__types-block');

  private allTypes = new ActivityBlock(
    this.typeOfChallenge.element,
    SvgNames.Star,
    this.dictionary.typeAll,
    'challenges__all challenges__activity',
  );

  private running = new ActivityBlock(
    this.typeOfChallenge.element,
    SvgNames.Running,
    this.dictionary.typeRunning,
    'challenges__running challenges__activity',
  );

  private cycling = new ActivityBlock(
    this.typeOfChallenge.element,
    SvgNames.Cycling,
    this.dictionary.typeCycling,
    'challenges__cycling challenges__activity',
  );

  private hiking = new ActivityBlock(
    this.typeOfChallenge.element,
    SvgNames.Hiking,
    this.dictionary.typeHiking,
    'challenges__hiking challenges__activity',
  );

  private walking = new ActivityBlock(
    this.typeOfChallenge.element,
    SvgNames.Walking,
    this.dictionary.typeWalking,
    'challenges__walking challenges__activity',
  );

  private typesAll: ActivityBlock[] = [];

  private resultTypesAll: ActivityBlock[] = [];

  private challengesBlock = new BaseComponent('div', this.formContainer.element, 'challenges__challenges-block');

  private hikingChallenge!: Challenge;

  private slothChallenge!: Challenge;

  private cyclingChallenge!: Challenge;

  private runningChallenge!: Challenge;

  private photoChallenge!: Challenge;

  private yogaChallenge!: Challenge;

  private challenges: string[] = [];

  private challengesForRequest: string[] = [];

  constructor(parent: HTMLElement) {
    super('section', parent, 'challenges challenges-section');
    this.getFriendsRequest();
    this.subscribeOnEvent();
  }

  private getFriendsRequest(): void {
    if (this.token) {
      getUser(this.token).then((user: User) => {
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

  private renderFirstChallenges(data: FriendData[]): void {
    const hikingUsers = Challenges.checkChallenges(data, ChallengesTypes.Hiking);
    this.hikingChallenge = new Challenge(
      this.challengesBlock.element,
      ChallengesTypes.Hiking,
      [Activities.Hiking, Activities.Walking, Activities.Running, Activities.Cycling],
      hikingUsers,
      this.dictionary.hikingTitle,
      this.dictionary.hikingDescription,
      ['03/01/2023', '03/01/2024'],
      true,
    );

    const slothUsers = Challenges.checkChallenges(data, ChallengesTypes.Sloth);
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

    const cyclingUsers = Challenges.checkChallenges(data, ChallengesTypes.Cycling);
    this.cyclingChallenge = new Challenge(
      this.challengesBlock.element,
      ChallengesTypes.Cycling,
      [Activities.Cycling],
      cyclingUsers,
      this.dictionary.cyclingTitle,
      this.dictionary.cyclingDescription,
      ['02/25/2023', '03/04/2023'],
      true,
    );
  }

  private renderSecondChallenges(data: FriendData[]): void {
    const runningUsers = Challenges.checkChallenges(data, ChallengesTypes.Running);
    this.runningChallenge = new Challenge(
      this.challengesBlock.element,
      ChallengesTypes.Running,
      [Activities.Hiking, Activities.Walking, Activities.Running, Activities.Cycling],
      runningUsers,
      this.dictionary.runningTitle,
      this.dictionary.runningDescription,
      ['03/01/2023', '03/01/2024'],
      true,
    );

    const photoUsers = Challenges.checkChallenges(data, ChallengesTypes.Photo);
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

    const yogaUsers = Challenges.checkChallenges(data, ChallengesTypes.Yoga);
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
    this.challengesAll.every((challenge) => {
      if (this.challenges.includes(challenge.type)) {
        // eslint-disable-next-line no-param-reassign
        challenge.setButtonFunction();
      }
      return challenge;
    });
  }

  private static checkChallenges(data: FriendData[], challenge: string): string[] {
    const avatars: string[] = [];
    const filtered = data.filter((user: FriendData) => user.challenges.includes(challenge));
    filtered.forEach((user: FriendData) => {
      avatars.push(user.avatarUrl);
    });
    return avatars;
  }

  private addListeners(): void {
    this.typesAll.forEach((type) => {
      type.element.addEventListener('click', () => {
        if (this.resultTypesAll.includes(type)) {
          this.resultTypesAll.splice(this.resultTypesAll.indexOf(type), 1);
        } else {
          this.resultTypesAll.push(type);
        }
        this.showVisibleChallenges();
      });
    });
  }

  private filterCards(): Challenge[] {
    return this.challengesAll.filter((challenge: Challenge): boolean => {
      return challenge.allTypes.some((typeInChallenge: string): boolean => {
        return this.resultTypesAll.some((type: ActivityBlock): boolean => {
          if (type.challengeName === 'all' || type.challengeName === 'Все виды') {
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

    const visibleChallenges = this.filterCards();
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

  private subscribeOnEvent(): void {
    eventEmitter.on('challengesUpdate', (): void => {
      this.check();
    });
  }

  private check(): void {
    this.challengesForRequest = this.getAllAddedChallenges();
    this.sendChallenges(this.challengesForRequest);
  }

  private getAllAddedChallenges(): string[] {
    const challengeTypes = this.challengesAll
      .filter((challenge) => challenge.challengeIsAdded === true)
      .map((challenge) => challenge.type);
    return challengeTypes;
  }

  private sendChallenges(data: string[]): void {
    if (this.token) {
      updateUser(this.token, { challenges: data.length === 0 ? [] : data });
    }
  }
}
