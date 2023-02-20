/* eslint-disable arrow-body-style */
/* eslint-disable max-len */
import './challenges.css';
import BaseComponent from '../../components/base-component/base-component';
import ActivityBlock from './activity-element/activity-element';
import SvgNames from '../../components/base-component/svg/svg.types';
import { checkDataInLocalStorage } from '../../utils/local-storage';
import users from '../../mock/find-friends.data';
import { ChallengesTypes, Activities } from './types-challenges';
import Challenge from './challenge/challenge';
import { Token } from '../../app/loader/loader-requests.types';
import { FriendData } from '../../app/loader/loader-responses.types';

export default class Challenges extends BaseComponent<'section'> {
  private dictionary: Record<string, string> = {
    title: 'Challenges', // перевод
    typeAll: 'All', // перевод 'Все виды'
    typeRunning: 'Running', // перевод
    typeCycling: 'Cycling', // перевод
    typeHiking: 'Hiking', // перевод
    typeWalking: 'Walking', // перевод
    hikingTitle: 'Conquer your Everest', // перевод
    hikingDescription:
      'Climb to a height of 8,849 meters in a year. Each of your trainings takes into account the height elevation that has been completed. Your task is to accumulate a height equal to the height of Everest in a year.', // перевод
    slothTitle: 'International Sloth Day', // перевод
    slothDescription:
      'Just relax. Spend the day doing nothing at all! Well... maybe just a little bit of movement to eat deliciously', // перевод
    cyclingTitle: 'Unbending spirit', // перевод
    cyclingDescription:
      "It can be hard to focus on a goal, but this week will be an exception. Take part in the challenge in which you have to make a trip by cycle every day. Are you ready? Let's go!", // перевод
    runningTitle: 'The Tour de Valiance', // перевод
    runningDescription:
      'Do you know The Tour de France - the most famous and most challenging 3,000 km cycle race in the world? Not everyone will be able to ride it, but you have a chance to ride, walk or run its length within a year. Will you accept the challenge?', // перевод
    photoTitle: 'Like Van Gogh', // перевод
    photoDescription:
      'Launch applications to track your movement and draw a picture (for example, a cat, a heart or maybe "The Starry Night"?) as you move. Tag #striversChallenge on your social media. We will share the coolest track pictures!', // перевод
    yogaTitle: 'Yours hours', // перевод
    yogaDescription:
      'Did you know that the first season of Game of Thrones is 9 hours and 27 minutes long? There are people who watched it in a week. Could you allocate the same amount of time for walking per week? We challenge you.', // перевод
  };

  private token: Token | null = checkDataInLocalStorage('userSessionToken');

  public usersData: FriendData[] = [];

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

  constructor(parent: HTMLElement) {
    super('section', parent, 'challenges challenges-section');
    this.getFriendsRequest();
  }

  private getFriendsRequest(): void {
    if (this.token) {
      // тут будет получение данных с сервера
      /* getFriends(this.token).then((usersData: FriendData[]): void => {
        this.usersData = usersData;
      }); */
      this.usersData = users;
      this.renderPage(this.usersData);
      this.addListeners();
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

  private static checkChallenges(data: FriendData[], challenge: string): string[] {
    const avatars: string[] = [];
    /* const filtered = data.filter((user: FriendData) => user.challenges.includes(challenge));
    filtered.forEach((user: FriendData) => {
      avatars.push(user.avatarUrl);
    }); */
    console.log(avatars, data, challenge);
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
}
