import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next.use(LanguageDetector).init({
  lng: localStorage.getItem('i18nextLng')?.toString() || 'en',
  debug: false,
  resources: {
    en: {
      translation: {
        avatar: 'Choose your avatar',
        select: '--Please choose your country--',
        header: {
          avatar: 'Your avatar',
          personalPage: 'Personal page',
          myRoutes: 'My routes',
          settings: 'Settings',
          exit: 'Exit',
          addActivity: 'Add new activity',
          addRoute: 'Add new route',
          findFriends: 'Find friends',
          challenges: 'Challenges',
        },
        footer: {
          ourTeam: 'About our team',
        },
        map: {
          locationBtn: 'Go to current location',
          clearBtn: 'Clear map',
          elevation: 'Elevation (meters)',
          locationFoundL: 'Location found!',
          routeNotFound: 'Unfortunately, we were unable to find such a route. Do you want to build a different route?',
        },
        addActivityPage: {
          heading: 'Add activity',
          distance: 'Distance (km)',
          duration: 'Duration',
          elevation: 'Elevation (m)',
          training: 'Type of activity',
          walking: 'Walking',
          running: 'Running',
          hiking: 'Hiking',
          cycling: 'Cycling',
          dateAndTime: 'Date and time',
          trainTogether: 'Train together',
          title: 'Name of activity',
          description: 'Desciption',
          descriptionPlaceholder: "How'd it go? Share more about your activity!",
          save: 'Save',
          searchIcon: 'search',
          morning: 'Morning',
          afternoon: 'Afternoon',
          evening: 'Evening',
          night: 'Night',
          run: 'run',
          hike: 'hike',
          ride: 'ride',
          walk: 'walk',
          mapTitle: 'Activity route',
        },
        dashboard: {
          leftMenu: {
            ourActivity: {
              monday: 'M',
              tuesday: 'T',
              wednesday: 'W',
              thursday: 'T',
              friday: 'F',
              saturday: 'S',
              sunday: 'S',
              weekHeader: 'This week',
              chooseSportHeadingMain: 'Choose your sports',
              yearHeader: 'This year',
              chooseSportHeadingError: 'Please, choose max 3 sports',
              noSports: 'No sport chosen yet',
            },
            profileCard: {
              followers: 'followers',
              followees: 'followees',
              activities: 'activities',
            },
            trainingJournal: {
              heading: 'Last activity',
              defaultMessage: 'No activities to show yet',
            },
          },
          rightMenu: {
            randomFriend: {
              secret: 'Secret place',
            },
            tasks: {
              participants: 'participants',
              heading: 'Your tasks',
              allTasksButton: 'All Tasks',
            },
            addNewRoute: 'Add new route',
            friendsHeading: 'Suggested friends',
          },
          trainingFeed: {
            message: "You don't have anything on your feed yet, you can",
            addActivity: 'Add Activity',
            findFriends: 'Find friends',
            post: {
              distance: 'Distance',
              speed: 'Speed',
              time: 'Time',
              elevation: 'Elevation',
              commentPlaceholder: 'type something up to 200 characters',
              commentBtn: 'Comment',
              km: 'km',
              m: 'm',
              at: 'at',
              addActivityBtn: 'Add Activity',
              findFriendsBtn: 'Find friends',
            },
          },
        },
        findFriends: {
          unsubscribeBtn: 'Unfollow',
          subscribeBtn: 'follow',
          activities: 'Activities',
          notFriendsTitle: 'Find friends',
          notFriendsSearch: 'Sportsman name',
          friendsSearch: 'Sportsman name',
          friendsTitle: 'My Subscriptions',
          noFriendsMessage:
            'It seems that you have no friends yet. You can find friends on the left side of this page.',
          allFriendsMessage: 'It seems that you have added all available users as friends.',
        },
        newRoute: {
          heading: 'Add route',
          addRoute: 'Add route',
          searchPlaceholder: 'Enter the name of the place or click on the map',
          routeType: 'Route type',
          walking: 'walking',
          cycling: 'cycling',
          saveBtn: 'Save',
          distance: 'Distance',
          ascent: 'Ascent',
          descent: 'Descent',
          duration: 'Duration',
          roadType: 'Road type',
          routeName: 'Route name',
          description: 'Description',
        },
        ourTeam: {
          title: 'Meet the Big Bug Theory team',
          info: 'We are a team of like-minded people with a positive attitude towards work.',
          matthewInfo: 'good person',
          lenaInfo: 'good person',
          nastyaInfo: 'good person',
          useTitle: 'Was used in this project',
        },
        splash: {
          forms: {
            signUp: 'Sign up',
            logIn: 'Log in',
            accountLoginHeading: 'Account Login',
            accountSignupHeading: 'Account Signup',
            loginMessage: 'If you have an account, you can login with e-mail',
            email: 'Email address',
            password: 'Password',
            notMember: 'Not a member? ',
            becomeMember: 'Become a member and enjoy exclusive promotions.',
            name: 'Full Name',
            alreadyMember: 'Already a member? ',
            logInHere: 'Log in here',
            signUpHere: 'Sign up here',
          },
        },
      },
    },
    rus: {
      translation: {
        avatar: 'Ваш аватар',
        select: '--Выберите Вашу страну--',
        header: {
          avatar: 'Ваш аватар',
          personalPage: 'Личная страница',
          myRoutes: 'Мои маршруты',
          settings: 'Настройки',
          exit: 'Выйти',
          addActivity: 'Добавить новую тренировку',
          addRoute: 'Добавить новый маршрут',
          findFriends: 'Найти друзей',
          challenges: 'Испытания',
        },
        footer: {
          ourTeam: 'О нашей команде',
        },
        map: {
          locationBtn: 'Перейти в указанную локацию',
          clearBtn: 'Очистить карту',
          elevation: 'Набор высоты (метры)',
          locationFoundL: 'Локация найдена!',
          routeNotFound: 'К сожалению мы не смогли найти данный маршрут. Построить заново?',
        },
        addActivityPage: {
          heading: 'Добавить тренировку',
          distance: 'Дистанция (км)',
          duration: 'Длительность',
          elevation: 'Подъем (м)',
          training: 'Тип тренировки',
          walking: 'Ходьба',
          running: 'Бег',
          hiking: 'Хайкинг',
          cycling: 'Велозаезд',
          dateAndTime: 'Дата и время',
          trainTogether: 'Добавь друга',
          title: 'Название тренировки',
          description: 'Описание',
          descriptionPlaceholder: 'Как все прошло? Поделитесь своим опытом',
          save: 'Сохранить',
          searchIcon: 'Искать',
          morning: 'Утренняя',
          afternoon: 'Дневная',
          evening: 'Вечерняя',
          night: 'Ночная',
          run: 'пробежка',
          hike: 'хайк',
          ride: 'велопрогулка',
          walk: 'прогулка',
          mapTitle: 'Маршрут тренировки',
        },
        dashboard: {
          leftMenu: {
            ourActivity: {
              monday: 'П',
              tuesday: 'В',
              wednesday: 'С',
              thursday: 'Ч',
              friday: 'П',
              saturday: 'С',
              sunday: 'В',
              weekHeader: 'На этой неделе',
              chooseSportHeadingMain: 'Выберите спорт',
              yearHeader: 'В этом году',
              chooseSportHeadingError: 'Максимум 3 спорта',
              noSports: 'Спорт не был выбран',
            },
            profileCard: {
              followers: 'Подписчики',
              followees: 'Друзья',
              activities: 'Тренировки',
            },
            trainingJournal: {
              heading: 'Последняя тренировка',
              defaultMessage: 'Пока нет тренировок',
            },
          },
          rightMenu: {
            randomFriend: {
              secret: 'Секретное место',
            },
            tasks: {
              participants: 'участников',
              heading: 'Ваши задания',
              allTasksButton: 'Все задания',
            },
            addNewRoute: 'Добавить новый маршрут',
            friendsHeading: 'Рекомендованные друзья',
          },
          trainingFeed: {
            message: 'У вас нет ничего в Вашей ленте, Вы можете',
            addActivity: 'Добавить тренировку',
            findFriends: 'Найти друзей',
            post: {
              distance: 'Дистанция',
              speed: 'Скорость',
              time: 'Время',
              elevation: 'Высота',
              commentPlaceholder: 'Введите Ваш комментарий. Максимум 200 символов',
              commentBtn: 'Отправить',
              km: 'км',
              m: 'м',
              at: 'в',
              addActivityBtn: 'Добавить тренировку',
              findFriendsBtn: 'Найти друзей',
            },
          },
        },
        findFriends: {
          unsubscribeBtn: 'Отписаться',
          subscribeBtn: 'Подписаться',
          activities: 'Тренировки',
          notFriendsTitle: 'Найти друзей',
          notFriendsSearch: 'Имя спортсмена',
          friendsSearch: 'Имя спортсмена',
          friendsTitle: 'Мои подписки',
          noFriendsMessage: 'У вас пока не добавлено ни одного друга. Вы можете найти друзей на левой стороне страницы',
          allFriendsMessage: 'Вы добавили всех возможных друзей.',
        },
        newRoute: {
          heading: 'Добавить маршрут',
          addRoute: 'Добавить маршрут',
          searchPlaceholder: 'Введите название места или кликните на карту',
          routeType: 'Тип маршрута',
          walking: 'Ходьба',
          cycling: 'Езда на велосипеде',
          saveBtn: 'Добавить',
          distance: 'Дистанция',
          ascent: 'Набор высоты',
          descent: 'Спуск',
          duration: 'Длительность',
          roadType: 'Тип покрытия',
          routeName: 'Имя маршрута',
          description: 'Описание маршрута',
        },
        ourTeam: {
          title: 'Встречаем the Big Bug Theory',
          info: 'Команда единомышленников, которые любят свою работу',
          matthewInfo: 'хороший человек',
          lenaInfo: 'хороший человек',
          nastyaInfo: 'хороший человек',
          useTitle: 'В этом проекте было использовано',
        },
        splash: {
          forms: {
            signUp: 'Зарегистрироваться',
            logIn: 'Войти',
            accountLoginHeading: 'Регистрация аккаунта',
            accountSignupHeading: 'Войти в аккаунт',
            loginMessage: 'Если у Вас уже есть аккаунт, можно зайти с помощью почты',
            email: 'e-mail адрес',
            password: 'Пароль',
            notMember: 'Нету аккаунта? ',
            becomeMember: 'Присоединяйтесь и получите доступ к эксклюзивным акциям.',
            name: 'Имя',
            alreadyMember: 'Уже есть аккаунт? ',
            logInHere: 'Войдите в аккаунт',
            signUpHere: 'Зарегистрируйте аккаунт',
          },
        },
      },
    },
  },
});
