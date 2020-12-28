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
};

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
};

const villains: VillainsScreenMessage = {
    title: 'Choose your villain!',
    options: ['Go back', 'Go to Heroes'],
};

export default script;
