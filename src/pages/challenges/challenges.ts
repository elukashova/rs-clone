import './challenges.css';
import BaseComponent from '../../components/base-component/base-component';
import ActivityBlock from './activity-element/activity-element';
import SvgNames from '../../components/base-component/svg/svg.types';

export default class Challenges extends BaseComponent<'section'> {
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

  constructor(parent: HTMLElement) {
    super('section', parent, 'challenges challenges-section');
  }
}
