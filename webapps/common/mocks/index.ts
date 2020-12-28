import {
    Screen,
    Intent,
    Operation,
    ScreenMessage,
    HomeScreenMessage,
    HeroesScreenMessage,
    VillainsScreenMessage,
} from '../../../dialogs/src/models';

const START = 'intent.internal.living-app.start';

const breadcrumbs: ScreenMessage[] = [];
let lastScreen: ScreenMessage | null = null;
let currentItem = 0;

const script = {
    [START]: (): ScreenMessage => screen(Screen.SPLASH),
    [Intent.HOME]: (): ScreenMessage => {
        lastScreen && breadcrumbs.push(lastScreen);
        lastScreen = screen(Screen.HOME, home);
        return lastScreen;
    },
    [Operation.HEROES]: (): ScreenMessage => {
        if (lastScreen) {
            breadcrumbs.push(lastScreen);
        }
        lastScreen = screen(Screen.HEROES, heroes);
        return lastScreen;
    },
    [Operation.VILLAINS]: (): ScreenMessage => {
        if (lastScreen) {
            breadcrumbs.push(lastScreen);
        }
        lastScreen = screen(Screen.VILLAINS, villains);
        return lastScreen;
    },
    [Operation.BACK]: (): ScreenMessage => {
        lastScreen = breadcrumbs.pop() || screen(Screen.HOME, home);
        return lastScreen;
    },
    [Operation.PREV]: (): ScreenMessage => {
        const response = actionPrevious(currentItem, (--currentItem + heroes.heroes.length) % heroes.heroes.length);
        breadcrumbs.push(response);
        return response;
    },
    [Operation.NEXT]: (): ScreenMessage => {
        return actionNext(currentItem, ++currentItem % heroes.heroes.length);
    },
};

const actionNext = (oldIndex: number, newIndex: number) => ({
    name: 'LIVING_APP.NEXT',
    parameters: {
        newIndex: newIndex,
        oldIndex: oldIndex,
    },
});

const actionPrevious = (oldIndex: number, newIndex: number) => ({
    name: 'LIVING_APP.PREVIOUS',
    parameters: {
        newIndex: newIndex,
        oldIndex: oldIndex,
    },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const screen = (screen: Screen, msg: Record<string, any> = {}) => {
    return {
        activeChannels: ['movistar-home', 'set-top-box'],
        screen,
        title: 'Welcome to Tour of Heroes!',
        ...msg,
    };
};

const home: HomeScreenMessage = {
    title: 'Welcome to Tour of Heroes!',
    options: ['Go to Heroes', 'Go to Villains'],
    suggestions: [
        {
            title: 'GO TO HEROES',
            intent: Operation.HEROES,
            entities: {},
        },
        {
            title: 'GO TO VILLAINS',
            intent: Operation.VILLAINS,
            entities: {},
        },
    ],
};

const heroes: HeroesScreenMessage = {
    title: 'Choose your heroe!',
    options: ['Go back', 'Go to Villains'],
    currentIndex: 0,
    heroes: [
        {
            name: 'Manbat',
            realName: 'Francisco Rodríguez',
            superpower: 'Super rich',
            loveInterest: 'Feline Female',
            nemesis: 'Prankster',
            group: 'Righteousness Union',
            icon: 'https://haac.azureedge.net/image/toh/manbat.png',
            color: 'white',
            bgColor: '#0d751e',
            secondaryColor: 'black',
        },
        {
            name: 'Steel Man',
            realName: 'Antonio Claro',
            superpower: 'Super rich too',
            loveInterest: 'Prepper Petts',
            nemesis: 'El Notas',
            group: 'Vindicators',
            icon: 'https://haac.azureedge.net/image/toh/mansteel.png',
            color: 'white',
            bgColor: 'black',
            secondaryColor: 'red',
            bgVideo: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        },
        {
            name: 'Manspider',
            realName: 'Pedro Parques',
            superpower: 'Strength, speed, agility, spider-sense',
            loveInterest: 'La Mary',
            nemesis: 'Blue Elf',
            group: 'Vindicators',
            icon: 'https://haac.azureedge.net/image/toh/manspider.png',
            bgColor: 'grey',
            color: 'blue',
            secondaryColor: 'red',
        },
    ],
    suggestions: [
        {
            title: 'GO TO VILLAINS',
            intent: Operation.VILLAINS,
            entities: {},
        },
        {
            title: 'NEXT',
            intent: Operation.NEXT,
            entities: {},
        },
        {
            title: 'PREVIOUS',
            intent: Operation.PREV,
            entities: {},
        },
        {
            title: 'HOME',
            intent: Intent.HOME,
            entities: {},
        },
    ],
};

const villains: VillainsScreenMessage = {
    title: 'Choose your villain!',
    options: ['Go back', 'Go to Heroes'],
    currentIndex: 0,
    villains: [
        {
            name: 'Prankster',
            nemesis: 'Manbat',
            superPower: 'Chemical engineering',
            icon:
                'https://w7.pngwing.com/pngs/220/144/png-transparent-green-haired-skull-illustration-joker-harley-quinn-batman-logo-dc-comics-joker-heroes-leaf-fictional-character-thumbnail.png',
            bgColor: '#20d63e',
            color: 'black',
            secondaryColor: 'white',
        },
        {
            name: 'El Notas',
            nemesis: 'All Vindicators',
            superPower: 'Infinity Stones',
            icon:
                'https://w7.pngwing.com/pngs/853/28/png-transparent-thanos-marvel-comics-the-infinity-gauntlet-comic-book-marvel-universe-american-comics-miscellaneous-comics-superhero-thumbnail.png',
            bgColor: '#c2b200',
            color: 'green',
            secondaryColor: '#fbbe00',
        },
        {
            name: 'Blue Elf',
            nemesis: 'Manspider',
            superPower: 'Strength, reflexes, agility',
            icon:
                'https://w7.pngwing.com/pngs/461/749/png-transparent-venom-spider-man-carnage-symbiote-television-carnage-fictional-characters-logo-fictional-character-thumbnail.png',
            bgColor: '#009130',
            color: 'black',
            secondaryColor: 'blue',
        },
        {
            name: 'Loko',
            nemesis: 'Ther',
            superPower: 'Astral projection, illusions, strength',
            icon:
                'https://w7.pngwing.com/pngs/296/261/png-transparent-loki-nerd-character-geek-helmet-loki-fictional-characters-fictional-character-march-thumbnail.png',
            bgColor: 'rgb(120, 0, 145)',
            color: 'green',
            secondaryColor: '#d1a400',
        },
    ],
    suggestions: [
        {
            title: 'GO TO HEROES',
            intent: Operation.HEROES,
            entities: {},
        },
        {
            title: 'HOME',
            intent: Intent.HOME,
            entities: {},
        },
    ],
};

const close = {
    activeChannels: ['movistar-home', 'set-top-box-haac'],
    text: 'Closing LA',
    screen: 'close',
};

export default script;
