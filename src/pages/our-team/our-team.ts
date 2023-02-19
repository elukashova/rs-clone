import './our-team.css';
import BaseComponent from '../../components/base-component/base-component';
import Member from './member/member';
import Svg from '../../components/base-component/svg/svg';
import SvgNames from '../../components/base-component/svg/svg.types';
import Picture from '../../components/base-component/picture/picture';
/* import Svg from '../../components/base-component/svg/svg';
 */
export default class OurTeam extends BaseComponent<'section'> {
  private formContainer = new BaseComponent('div', this.element, 'our-team__container');

  private title = new BaseComponent(
    'h2',
    this.formContainer.element,
    'our-team__title titles',
    'Meet the Big Bug Theory team',
  );

  private infoAboutTeam = new BaseComponent(
    'p',
    this.formContainer.element,
    'our-team__full-info',
    'We are a team of like-minded people with a positive attitude towards work.',
  );

  private photoContainer = new BaseComponent('div', this.formContainer.element, 'our-team__member-container');

  private matthew = new Member(this.photoContainer.element, 'matthewthewizzard', 'good person', 'Mikhail Matveev');

  private lena = new Member(this.photoContainer.element, 'elukashova', 'good person', 'Elena Lukashova');

  private nastya = new Member(this.photoContainer.element, 'trickypie', 'good person', 'Anastasia Klimova');

  private useInProject = new BaseComponent('div', this.formContainer.element, 'our-team__project-info');

  private useTitle = new BaseComponent(
    'h3',
    this.useInProject.element,
    'our-team__project-title',
    'Was used in this project',
  );

  private svgContainer = new BaseComponent('div', this.useInProject.element, 'our-team__project-svg-block');

  private nestJs = new Svg(this.svgContainer.element, SvgNames.Nestjs, '#FF0000', 'our-team__project-svg');

  private prisma = new Svg(this.svgContainer.element, SvgNames.Prisma, '#00468b', 'our-team__project-svg');

  private jwt = new Svg(this.svgContainer.element, SvgNames.Jsonwebtokens, '', 'our-team__project-svg');

  private postgreSql = new Svg(this.svgContainer.element, SvgNames.Postgresql, '', 'our-team__project-svg');

  private ts = new Svg(this.svgContainer.element, SvgNames.Typescript, '', 'our-team__project-svg');

  private webpack = new Svg(this.svgContainer.element, SvgNames.Webpack, '', 'our-team__project-svg');

  private github = new Svg(this.svgContainer.element, SvgNames.Github, '', 'our-team__project-svg');

  private bcrypt = new Picture(this.svgContainer.element, 'our-team__project-img', {
    src: './assets/icons/png/bcrypt.png',
    style: 'height:3em; width:10em',
  });

  private restCountries = new Picture(this.svgContainer.element, 'our-team__project-img', {
    src: './assets/icons/png/rest-countries.png',
  });

  private googleMaps = new Picture(this.svgContainer.element, 'our-team__project-img', {
    src: './assets/icons/png/google-maps-api.png',
  });

  private googleDirections = new Picture(this.svgContainer.element, 'our-team__project-img', {
    src: './assets/icons/png/google-directions-api.png',
  });

  private googleElevation = new Picture(this.svgContainer.element, 'our-team__project-img', {
    src: './assets/icons/png/google-elevation-api.png',
  });

  private googleSignIn = new Picture(this.svgContainer.element, 'our-team__project-img', {
    src: './assets/icons/png/google-signin.png',
  });

  constructor(parent: HTMLElement) {
    super('section', parent, 'our-team our-team-section');
  }
}
