import './Villains.scss';

import { AuraCommands, Footer, screenReady, useAura, useBackground } from '@telefonica/la-web-sdk';
import React, { useCallback, useEffect } from 'react';
import { Intent, VillainsScreenMessage } from '../../../../../dialogs/src/models';
import Button from '../../component/button';

export const VillainsScreen: React.FC<VillainsScreenMessage> = (data: VillainsScreenMessage) => {
    const { clearBackground } = useBackground();
    const { sendCommand } = useAura();

    useEffect(() => {
        clearBackground();
    }, [clearBackground]);

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
                <Button id="back-button" defaultFocused={true} text={data.options[0]} onClick={goBack} />
                <Button id="heroes-button" text={data.options[1]} onClick={goToHeroes} />
            </Footer>
        </div>
    );
};

export default screenReady(VillainsScreen);
