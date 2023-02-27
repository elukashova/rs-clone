import './our-team.css';
import BaseComponent from '../../components/base-component/base-component';
import Member from './member/member';
import Svg from '../../components/base-component/svg/svg';
import SvgNames from '../../components/base-component/svg/svg.types';
import Picture from '../../components/base-component/picture/picture';

export default class OurTeam extends BaseComponent<'section'> {
  private dictionary: Record<string, string> = {
    title: 'ourTeam.title',
    info: 'ourTeam.info',
    matthewInfo: 'ourTeam.matthewInfo',
    lenaInfo: 'ourTeam.lenaInfo',
    nastyaInfo: 'ourTeam.nastyaInfo',
    useTitle: 'ourTeam.useTitle',
  };

  private formContainer = new BaseComponent('div', this.element, 'our-team__container');

  private title = new BaseComponent('h2', this.formContainer.element, 'our-team__title titles', this.dictionary.title);

  /*   private infoAboutTeam = new BaseComponent(
    'p',
    this.formContainer.element,
    'our-team__full-info',
    this.dictionary.info,
  ); */

  private photoContainer = new BaseComponent('div', this.formContainer.element, 'our-team__member-container');

  private matthew = new Member(
    this.photoContainer.element,
    'matthewthewizzard',
    this.dictionary.matthewInfo,
    'Mikhail Matveev',
  );

  private lena = new Member(this.photoContainer.element, 'elukashova', this.dictionary.lenaInfo, 'Elena Lukashova');

  private nastya = new Member(
    this.photoContainer.element,
    'trickypie',
    this.dictionary.nastyaInfo,
    'Anastasia Klimova',
  );

  private useInProject = new BaseComponent('div', this.formContainer.element, 'our-team__project-info');

  private useTitle = new BaseComponent(
    'h3',
    this.useInProject.element,
    'our-team__project-title',
    this.dictionary.useTitle,
  );

  private svgContainer = new BaseComponent('div', this.useInProject.element, 'our-team__project-svg-block');

  private nestJs = new Svg(this.svgContainer.element, SvgNames.Nestjs, '#FF0000', 'our-team__project-svg');

  private prisma = new Svg(this.svgContainer.element, SvgNames.Prisma, '#00468b', 'our-team__project-svg');

  private jwt = new Svg(this.svgContainer.element, SvgNames.Jsonwebtokens, '', 'our-team__project-svg');

  private postgreSql = new Svg(this.svgContainer.element, SvgNames.Postgresql, '', 'our-team__project-svg');

  private ts = new Svg(this.svgContainer.element, SvgNames.Typescript, '', 'our-team__project-svg');

  private webpack = new Svg(this.svgContainer.element, SvgNames.Webpack, '', 'our-team__project-svg');

  private github = new Svg(this.svgContainer.element, SvgNames.Github, '', 'our-team__project-svg');

  private i18next = new Picture(this.svgContainer.element, 'our-team__project-img', {
    src: './assets/icons/svg/i18next.svg',
    style: 'height:3em; width:6em',
    alt: 'i18next',
  });

  private bcrypt = new Picture(this.svgContainer.element, 'our-team__project-img', {
    src: './assets/icons/png/bcrypt.png',
    style: 'height:3em; width:10em',
    alt: 'bcrypt',
  });

  private googleMaps = new Picture(this.svgContainer.element, 'our-team__project-img', {
    src: './assets/icons/png/google-maps-api.png',
    atl: 'google maps',
  });

  private googleDirections = new Picture(this.svgContainer.element, 'our-team__project-img', {
    src: './assets/icons/png/google-directions-api.png',
    alt: 'google directions',
  });

  private googleElevation = new Picture(this.svgContainer.element, 'our-team__project-img', {
    src: './assets/icons/png/google-elevation-api.png',
    alt: 'google elevation',
  });

  private googleStatic = new Picture(this.svgContainer.element, 'our-team__project-img', {
    src: './assets/icons/png/google-static-api.png',
    alt: 'google statistic',
  });

  private googleSignIn = new Picture(this.svgContainer.element, 'our-team__project-img', {
    src: './assets/icons/png/google-signin.png',
    alt: 'google sign in',
  });

  constructor(parent: HTMLElement) {
    super('section', parent, 'our-team our-team-section');
  }
}
