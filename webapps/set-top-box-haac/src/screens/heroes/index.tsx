import './Heroes.scss';

import { NavigableButton, Footer, useAura, useBackground, AuraCommands, screenReady } from '@telefonica/la-web-sdk';
import React, { useCallback, useEffect } from 'react';
import { HeroesScreenMessage, Intent } from '../../../../../dialogs/src/models';

const HeroesScreen: React.FC<HeroesScreenMessage> = (data: HeroesScreenMessage) => {
    const background = useBackground();
    const { sendCommand } = useAura();

    useEffect(() => {
        background.clearBackground();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                <NavigableButton
                    id="back-button"
                    defaultClass="button"
                    focusedClass="focused-button"
                    defaultFocused={true}
                    onClick={goBack}
                >
                    {data.options[0]}
                </NavigableButton>
                <NavigableButton
                    id="villains-button"
                    defaultClass="button"
                    focusedClass="focused-button"
                    onClick={goToVillains}
                >
                    {data.options[1]}
                </NavigableButton>
            </Footer>
        </div>
    );
};

export default screenReady(HeroesScreen);
