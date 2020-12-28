import React, { useCallback, useEffect } from 'react';
import { AuraCommands, NavigableButton, screenReady, useAura, useBackground } from '@telefonica/la-web-sdk';
import { HomeScreenMessage, Operation } from '../../../../../dialogs/src/models';

import './Home.scss';

const HomeScreen: React.FC<HomeScreenMessage> = (data: HomeScreenMessage) => {
    const { sendCommand } = useAura();
    const { clearBackground } = useBackground();

    useEffect(() => {
        clearBackground();
    }, [clearBackground]);

    const goToHeroes = useCallback(() => {
        sendCommand(AuraCommands.getAuraCommand(Operation.HEROES));
    }, [sendCommand]);

    const goToVillains = useCallback(() => {
        sendCommand(AuraCommands.getAuraCommand(Operation.VILLAINS));
    }, [sendCommand]);

    return (
        <div id="home-wrapper">
            <div id="heroes-wrapper">
                <NavigableButton
                    id="heroes-button"
                    defaultClass="home-button"
                    focusedClass="focused-home"
                    defaultFocused={true}
                    onClick={goToHeroes}
                >
                    {data.options[0]}
                </NavigableButton>
            </div>
            <div id="villains-wrapper">
                <NavigableButton
                    id="villains-button"
                    defaultClass="home-button"
                    focusedClass="focused-home"
                    onClick={goToVillains}
                >
                    {data.options[1]}
                </NavigableButton>
            </div>
        </div>
    );
};

export default screenReady(HomeScreen);
