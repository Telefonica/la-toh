import './Villains.scss';

import { AuraCommands, Footer, NavigableButton, screenReady, useAura, useBackground } from '@telefonica/la-web-sdk';
import React, { useCallback, useEffect } from 'react';
import { Intent, VillainsScreenMessage } from '../../../../../dialogs/src/models';

export const VillainsScreen: React.FC<VillainsScreenMessage> = (data: VillainsScreenMessage) => {
    const background = useBackground();
    const { sendCommand } = useAura();

    useEffect(() => {
        background.clearBackground();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const goBack = useCallback(() => {
        sendCommand(AuraCommands.getBack());
    }, [sendCommand]);

    const goToHeroes = useCallback(() => {
        sendCommand(AuraCommands.getAuraCommand(Intent.HEROES));
    }, [sendCommand]);

    return (
        <div id="villains">
            <h1 id="title"> {data.title}</h1>
            <Footer>
                <NavigableButton
                    id="back-button"
                    defaultClass="button"
                    defaultFocused={true}
                    focusedClass="focused-button"
                    onClick={goBack}
                >
                    {data.options[0]}
                </NavigableButton>
                <NavigableButton
                    id="heroes-button"
                    defaultClass="button"
                    focusedClass="focused-button"
                    onClick={goToHeroes}
                >
                    {data.options[1]}
                </NavigableButton>
            </Footer>
        </div>
    );
};

export default screenReady(VillainsScreen);
