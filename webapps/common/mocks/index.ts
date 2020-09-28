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
    [Intent.HEROES]: (): ScreenMessage => {
        if (lastScreen) {
            breadcrumbs.push(lastScreen);
        }
        lastScreen = screen(Screen.HEROES, heroes);
        return lastScreen;
    },
    [Intent.VILLAINS]: (): ScreenMessage => {
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
        ...msg,
    };
};

const home: HomeScreenMessage = {
    title: 'Welcome to Tour of Heroes!',
    options: ['Go to Heroes', 'Go to Villains'],
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
};

const villains: VillainsScreenMessage = {
    title: 'Choose your villain!',
    options: ['Go back', 'Go to Heroes'],
};

export default script;
