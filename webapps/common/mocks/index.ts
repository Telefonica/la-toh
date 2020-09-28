import { Screen, Intent, HomeScreenMessage } from '../../../dialogs/src/models';

const START = 'intent.internal.living-app.start';

const script = {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    [START]: () => screen(Screen.SPLASH),
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    [Intent.HOME]: () => screen(Screen.HOME, home),
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

export default script;
