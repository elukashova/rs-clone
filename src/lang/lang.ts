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
        settings: {
          genderTitle: 'Gender',
          genderDefault: 'Prefer not to say',
          genderMan: 'Man',
          genderWoman: 'Woman',
          heading: 'My profile',
          deleteAccount: 'Delete account',
          name: 'Name',
          email: 'Email',
          dateOfBirth: 'Date of birth',
          country: 'Country',
          bio: 'Short bio',
        },
        other: {
          km: '{{count}} km',
          hour: '{{count}} hr',
          meterArrow: '&uarr; {{count}} m',
          meter: '{{count}} m',
          speed: '{{count}} km/h',
          minute: '{{count}} m',
          at: 'at',
          comment: {
            now: 'Just now',
            seeAll: 'See all {{count}} comments',
            showRecent: 'Show recent comments',
            year_one: '{{count}} year ago',
            month_one: '{{count}} month ago',
            day_one: '{{count}} day ago',
            hour_one: '{{count}} hour ago',
            minute_one: '{{count}} minute ago',
            second_one: '{{count}} second ago',
            year_other: '{{count}} years ago',
            month_other: '{{count}} months ago',
            day_other: '{{count}} days ago',
            hour_other: '{{count}} hours ago',
            minute_other: '{{count}} minutes ago',
            second_other: '{{count}} seconds ago',
            kudo_one: '{{count}} kudo',
            kudo_other: '{{count}} kudos',
          },
        },
        header: {
          avatar: 'Your avatar',
          personalPage: 'Personal page',
          myRoutes: 'My routes',
          settings: 'Settings',
          exit: 'Log out',
          addActivity: 'Add new activity',
          addRoute: 'Add new route',
          findFriends: 'Find friends',
          challenges: 'Challenges',
        },
        footer: {
          ourTeam: 'Our team',
        },
        map: {
          locationBtn: 'Go to current location',
          elevationError: "Can't show elevation",
          clearBtn: 'Clear map',
          elevation: 'Elevation (meters)',
          locationFound: 'Location found!',
          routeNotFound: 'Unfortunately, we were unable to find such a route. Do you want to build a different route?',
          ok: 'OK',
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
          description: 'Description',
          descriptionPlaceholder: "How'd it go? Share more about your activity!",
          save: 'Save',
          searchIcon: 'search',
          morning: 'Morning',
          afternoon: 'Afternoon',
          evening: 'Evening',
          night: 'Night',
          morningHike: 'Morning',
          afternoonHike: 'Afternoon',
          eveningHike: 'Evening',
          nightHike: 'Night',
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
              followees: 'following',
              activities: 'activities',
              defaultBio: 'Share something about youself',
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
          notFriendsSearch: 'Athlete name',
          friendsSearch: 'Athlete name',
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
        challenges: {
          participants: 'Participants',
          friendsInChallenge: 'Friends in challenge: {{count}}',
          noProgress: 'Challenge without progress check',
          hikingChallenge: 'Conquer your Everest',
          runningChallenge: 'The Tour de Valiance',
          slothChallenge: 'International Sloth Day',
          cyclingChallenge: 'Unbending spirit',
          title: 'Challenges',
          headingChallenges: 'Your challenges',
          typeAll: 'All',
          typeRunning: 'Running',
          typeCycling: 'Cycling',
          typeHiking: 'Hiking',
          typeWalking: 'Walking',
          hikingTitle: 'Conquer your Everest',
          hikingDescription:
            'Climb to a height of 8,849 meters in a year. Each of your trainings takes into account the elevation gain that has been completed. Your task is to accumulate a height equal to the height of Everest in a year.',
          slothTitle: 'International Sloth Day',
          slothDescription:
            'Just relax. Spend the day doing nothing at all! Well... maybe just a little bit of movement to find something delicious to eat.',
          cyclingTitle: 'Unbending spirit',
          cyclingDescription:
            "It can be hard to focus on a goal, but this week will be an exception. Take part in a challenge in which you have to take a bike ride every day. Are you ready? Let's go!",
          runningTitle: 'The Tour de Valiance',
          runningDescription:
            'Do you know The Tour de France - the most famous and most challenging 3,000 km bicycle race in the world? Not everyone would be able to finish it, but you have a chance to ride, walk or run its length within a year. Will you accept the challenge?',
          photoTitle: 'Like Van Gogh',
          photoDescription:
            'Use GPS tracking to map out your workout route and draw a sketch (for example, a cat, a heart or maybe "The Starry Night"?) as you move. Tag #striversChallenge on your social media. We will share the coolest track drawing!',
          yogaTitle: 'Your time',
          yogaDescription:
            'Did you know that the first season of Game of Thrones is 9 hours and 27 minutes long? There are people who watched it in a week. Could you allocate the same amount of time for walking per week? We challenge you.',
          challengeOver: 'Sorry, challenge is over',
          acceptButton: 'Accept',
          acceptedButton: 'Accepted',
          challengeEnd_one: 'There is {{count}} day to the end of the challenge',
          challengeEnd_other: 'There are {{count}} days to the end of the challenge',
        },
        ourTeam: {
          title: 'Meet the Big Bug Theory team',
          info: 'We are a team of like-minded people with a positive attitude towards work.',
          matthewInfo:
            "The team's ninja - quiet, focused, and always ready to jump in with a new idea or a good joke. He is here to chew bubblegum and write code, and he is all out of bubblegum.",
          lenaInfo:
            'The almighty hero of the team that never sleeps, but writes code (or goes on a hike). Knows frontend, knows backend, and, as a matter of fact, every other end if you ask her to.',
          nastyaInfo:
            'No ordinary coder who can turn any project into a magic world of kittens and rainbows. Need to use a new API for your project? She got it. Need some help? She is here for you.',
          useTitle: 'What we used in this project',
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
            becomeMember: 'Become a member and share your athletic achievements.',
            name: 'Full Name',
            alreadyMember: 'Already a member? ',
            logInHere: 'Log in here',
            signUpHere: 'Sign up here',
            country: 'Country',
          },
          errors: {
            Name: 'The name must contain two subnames, each at least 3 letters long',
            Email: 'Please, provide a valid email',
            Password: 'The password must contain a minimum of 5 characters, including 1 digit and 1 uppercase letter',
            EmptyValue_country: 'Please, enter your country',
            EmptyValue_name: 'Please, enter your name',
            EmptyValue_password: 'Please, enter your password',
            EmptyValue_email: 'Please, enter your e-mail',
            Country: 'Please, provide a valid country name',
            Number: 'This input should be a number',
            Time: 'Please, provide any number below 59',
            UserAlreadyExists: 'An account with this email already exists. Please choose another one or ',
            InvalidCredentials: 'Invalid email or password. Please enter valid credentials or ',
          },
        },
      },
    },
    rus: {
      translation: {
        avatar: 'Ваш аватар',
        select: '--Выберите Вашу страну--',
        settings: {
          genderTitle: 'Пол',
          genderDefault: 'Не важно',
          genderMan: 'Мужчина',
          genderWoman: 'Женщина',
          heading: 'Мой профиль',
          deleteAccount: 'Удалить аккаунт',
          name: 'Имя',
          email: 'Эл. почта',
          dateOfBirth: 'Дата рождения',
          country: 'Страна',
          bio: 'О себе',
        },
        other: {
          km: '{{count}} км',
          hour: '{{count}} ч',
          meterArrow: '&uarr; {{count}} м',
          meter: '{{count}} м',
          speed: '{{count}} км/ч',
          minute: '{{count}} м',
          at: 'в',
          comment: {
            now: 'Только что',
            seeAll_many: 'Открыть все {{count}} комментариев',
            seeAll_few: 'Открыть все {{count}} комментария',
            showRecent: 'Показать последние коментарии',
            year_one: '{{count}} год назад',
            month_one: '{{count}} месяц назад',
            day_one: '{{count}} день назад',
            hour_one: '{{count}} час назад',
            minute_one: '{{count}} минута назад',
            second_one: '{{count}} секунда назад',
            year_many: '{{count}} лет назад',
            month_many: '{{count}} месяцев назад',
            day_many: '{{count}} дней назад',
            hour_many: '{{count}} часов назад',
            minute_many: '{{count}} минут назад',
            second_many: '{{count}} секунд назад',
            year_few: '{{count}} года назад',
            month_few: '{{count}} месяца назад',
            day_few: '{{count}} дня назад',
            hour_few: '{{count}} часа назад',
            minute_few: '{{count}} минуты назад',
            second_few: '{{count}} секунды назад',
            kudo_one: '{{count}} респект',
            kudo_many: '{{count}} респектов',
            kudo_few: '{{count}} респекта',
          },
        },
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
          locationBtn: 'В текущую локацию',
          clearBtn: 'Очистить карту',
          elevation: 'Набор высоты (метры)',
          ok: 'Хорошо',
          elevationError: 'Нельзя показать набор высоты',
          locationFound: 'Локация найдена!',
          routeNotFound: 'К сожалению, мы не смогли найти данный маршрут. Построить заново?',
        },
        addActivityPage: {
          heading: 'Добавить тренировку',
          distance: 'Дистанция (км)',
          duration: 'Длительность',
          elevation: 'Набор высоты (м)',
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
          morningHike: 'Утренний',
          afternoonHike: 'Дневной',
          eveningHike: 'Вечерний',
          nightHike: 'Ночной',
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
              followees: 'Подписки',
              activities: 'Тренировки',
              defaultBio: 'Добавьте информацию о себе',
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
            },
            addNewRoute: 'Добавить новый маршрут',
            friendsHeading: 'Рекомендованные друзья',
          },
          trainingFeed: {
            message: 'Ваша лента пока пуста, Вы можете',
            addActivity: 'Добавить тренировку',
            findFriends: 'Найти друзей',
            post: {
              distance: 'Дистанция',
              speed: 'Скорость',
              time: 'Время',
              elevation: 'Высота',
              commentPlaceholder: 'Добавьте ваш комментарий (максимум 200 символов)',
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
          noFriendsMessage: 'У вас пока не добавлено ни одного друга. Вы можете найти друзей в левой части страницы',
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
        challenges: {
          participants: 'Участники',
          friendsInChallenge: 'Друзей участвуют: {{count}}',
          noProgress: 'В этом испытании прогресс не отслеживается',
          headingChallenges: 'Испытания',
          title: 'Испытания',
          typeAll: 'Все виды',
          typeRunning: 'Бег',
          typeCycling: 'Велозаезд',
          typeHiking: 'Хайк',
          typeWalking: 'Ходьба',
          hikingTitle: 'Покорите свой Эверест',
          hikingDescription:
            'Поднимитесь на высоту 8,849 метров за один год. Каждая законченная тренировка считает высоту подъема и добавляет ее к общему количеству. Ваша задача — за год набрать высоту, равную высоте Эвереста.',
          slothTitle: 'Международный день ленивца',
          slothDescription:
            'Можете расслабиться. Ничего не делайте в этот день! Разве что... пробежка до холодильника?',
          cyclingTitle: 'Несгибаемый дух',
          cyclingDescription:
            'Бывает сложно сфокусироваться на цели, но только не на этой неделе. В этом испытании, вам нужно совершать велозаезд каждый день. Готовы крутить педали? Поехали!',
          runningTitle: 'Тур de Valiance',
          runningDescription:
            'Если вы знакомы с туром de France - самым известным и сложным 3,000 км велозаезде в мире, то знаете, что не каждый способен его пройти, но у вас есть возможность проехать, пройти или пробежать это же расстояние за один год. Готовы рискнуть?',
          photoTitle: 'Как Ван Гог',
          photoDescription:
            'Запустите GPS-трекер, чтобы отследить вашу тренировку и нарисовать картину (например, кошку, сердечко или "Звездную Ночь") во время движения. Поделитесь своей работой в соц.сетях с хештегом #striversChallenge, и мы выложим самые классные работы',
          yogaTitle: 'Ваш час',
          yogaDescription:
            'А вы знали, что первый сезон Игры Престолов длится 9 часов и 29 минут? Некоторые умудрились посмотреть его за неделю. А сможете ли вы потратить столько же времени в неделю на ходьбу? Проверим!',
          challengeOver: 'К сожалению, испытание уже закончилось',
          acceptButton: 'Принять',
          acceptedButton: 'Вызов принят',
          challengeEnd_one: '{{count}} день до конца испытания',
          challengeEnd_few: '{{count}} дня до конца испытания',
          challengeEnd_many: '{{count}} дней до конца испытания',
        },
        ourTeam: {
          title: 'Встречаем the Big Bug Theory',
          info: 'Команда единомышленников, которые любят свою работу',
          matthewInfo:
            'Истинный ниндзя — спокойный, сосредоточенный и всегда готовый подкинуть новую идею или хорошую шутку. Он здесь, чтобы жевать жвачку и писать код, и... у него закончилась жвачка.',
          lenaInfo:
            'Всемогущая героиня команды, которая никогда не спит, а пишет код (или ходит в горные походы). Знает фронтенд, знает бэкенд и вообще любой другой "енд", если вы ее об этом хорошо попросите.',
          nastyaInfo:
            'Неординарная кодерша, которая может превратить любой проект в волшебный мир котят и радуг. Вам нужна новая API для проекта? Она разберется. Нужно чем-то помочь? Она уже спешит к тебе!',
          useTitle: 'В этом проекте было использовано',
        },
        splash: {
          errors: {
            Name: 'Имя должно состоять из двух слов, по 3 буквы минимум',
            Email: 'Введите правильный адрес почты',
            Password: 'Пароль должен состоять минимум из 5 символов, включая одну цифру и одну заглавную букву',
            // EmptyValue: 'Введите свое ',
            EmptyValue_country: 'Введите свою страну',
            EmptyValue_name: 'Введите свое имя',
            EmptyValue_password: 'Введите свой пароль',
            EmptyValue_email: 'Введите свою эл. почту',
            Country: 'Введите правильное название страны',
            Number: 'Здесь должно быть число',
            Time: 'Введите любое число меньше 59',
            UserAlreadyExists: 'Аккаунт с данным эл. адресом уже существует. Выберите другой или ',
            InvalidCredentials: 'Неверное имя или пароль. Введите правильные данные или ',
          },
          forms: {
            signUp: 'Зарегистрироваться',
            logIn: 'Войти',
            accountLoginHeading: 'Регистрация аккаунта',
            accountSignupHeading: 'Войти в аккаунт',
            loginMessage: 'Если у Вас уже есть аккаунт, введите данные для входа',
            email: 'Эл. почта',
            password: 'Пароль',
            notMember: 'Нет аккаунта? ',
            becomeMember: 'Присоединяйтесь, чтобы делиться вашими спортивными успехами.',
            name: 'Имя',
            alreadyMember: 'Уже есть аккаунт? ',
            logInHere: 'Войдите в аккаунт',
            signUpHere: 'Зарегистрируйте аккаунт',
            country: 'Страна',
          },
        },
      },
    },
  },
});
