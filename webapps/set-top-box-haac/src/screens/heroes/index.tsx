import './Heroes.scss';

import { Footer, useAura, useBackground, AuraCommands, screenReady } from '@telefonica/la-web-sdk';
import React, { useCallback, useEffect } from 'react';
import { HeroesScreenMessage, Intent } from '../../../../../dialogs/src/models';
import Button from '../../component/button';

const HeroesScreen: React.FC<HeroesScreenMessage> = (data: HeroesScreenMessage) => {
    const { clearBackground } = useBackground();
    const { sendCommand } = useAura();

    useEffect(() => {
        clearBackground();
    }, [clearBackground]);

    const goBack = useCallback(() => {
        sendCommand(AuraCommands.getBack());
    }, [sendCommand]);

    const goToVillains = useCallback(() => {
        sendCommand(AuraCommands.getAuraCommand(Intent.VILLAINS));
    }, [sendCommand]);

    return (
        <div id="heroes-wrapper">
            <h1 id="title"> {data.title} </h1>
            <Footer>
                <Button id="back-button" defaultFocused={true} text={data.options[0]} onClick={goBack} />
                <Button id="villains-button" text={data.options[1]} onClick={goToVillains} />
            </Footer>
        </div>
    );
};

export default screenReady(HeroesScreen);
