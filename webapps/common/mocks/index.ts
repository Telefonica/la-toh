import { Screen, Intent, HomeScreenMessage } from '../../../dialogs/src/models';

const START = 'intent.internal.living-app.start';

type ScreenMessage = {
    activeChannels: string[];
    screen: Screen | string;
    [key: string]: unknown;
};

const script = {
    [START]: (): ScreenMessage => screen(Screen.SPLASH),
    [Intent.HOME]: (): ScreenMessage => screen(Screen.HOME, home),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const screen = (screen: Screen, msg: Record<string, any> = {}): ScreenMessage => {
    return {
        activeChannels: ['movistar-home', 'set-top-box'],
        screen,
        ...msg,
    };
};

const home: HomeScreenMessage = {
    title: 'Welcome to living apps!',
};

export default script;
