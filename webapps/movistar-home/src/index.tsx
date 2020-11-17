import 'react-app-polyfill/stable'; // TODO: this isn't necessary. Also check browserslist.

import script from '../../common/mocks';
import { init, Channel } from '@telefonica/la-web-sdk';
import { Screen } from '../../../dialogs/src/models';
import { SplashScreen } from './screens/splash';
import ErrorRscreen from './screens/error';
import MhSuggestionsWrapper from './components/mhSuggestionsWrapper';

init({
    channel: Channel.MH,
    laName: process.env.REACT_APP_LA_NAME as string,
    screens: {
        [Screen.SPLASH]: () => SplashScreen,
        [Screen.ERROR]: () => ErrorRscreen,
        [Screen.HOME]: () => MhSuggestionsWrapper,
        [Screen.HEROES]: () => MhSuggestionsWrapper,
        [Screen.VILLAINS]: () => MhSuggestionsWrapper,
    },
    buildNumber: process.env.BUILD_NUMBER,
    auraMockClient:
        process.env.REACT_APP_AURA_MOCK_CLIENT !== 'true'
            ? undefined
            : {
                  script,
                  pendingTerms: false,
              },
});
