import React, { useEffect } from 'react';
import { AuraCommands, Preloadable, useAura, useBackground } from '@telefonica/la-web-sdk';

import { Intent } from '../../../../../dialogs/src/models';
import './Splash.scss';
import splashBg from '../../assets/manbat-splash.svg';

const SplashScreen: React.FC<Preloadable> = ({ onReady }: Preloadable) => {
    const background = useBackground(); // to be able to show a background
    const { sendCommand } = useAura(); // to send commands to aura

    useEffect(() => {
        // the method setBackground is used to use the svg as the background of the screen
        background.setBackground(splashBg).then((img: HTMLImageElement) => {
            // if for example the svg could not be set as the background,
            // a background color is set
            if (!img) {
                background.setBackgroundColor('black');
            }
            // navigate to home screen
            sendCommand(AuraCommands.getAuraCommand(Intent.HOME));
            // with this method we notify the sdk that this component is ready to be shown
            onReady();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onReady, sendCommand]);

    return <div id="splash">Welcome to the Tour of Heroes!</div>;
};

export default SplashScreen;
