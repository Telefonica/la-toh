import React, { useEffect } from 'react';
import { Preloadable, useAura } from '@telefonica/la-web-sdk';
import { Intent } from '../../../../../dialogs/src/models';
import './Splash.scss';

export const SplashScreen: React.FC<Preloadable> = ({ onReady, screenData }: Preloadable) => {
    const { sendCommand } = useAura();

    useEffect(() => {
        onReady();
        sendCommand({ intent: Intent.HOME, entities: [] });
    }, [onReady, sendCommand]);

    return <div id="splash">{screenData.title}</div>;
};
