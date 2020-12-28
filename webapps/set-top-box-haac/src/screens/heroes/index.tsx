import './Heroes.scss';
import {
    Footer,
    AuraCommands,
    screenReady,
    KeyEvent,
    useVideo,
    KeyCode,
    useActions,
    useAura,
    useBackground,
    useInput,
    useBack,
} from '@telefonica/la-web-sdk';
import React, { useCallback, useEffect, useState } from 'react';
import { ActionMessage, HeroesScreenMessage, Operation } from '../../../../../dialogs/src/models';
import { HeroComponent } from './hero';
import Button from '../../component/button';

const HeroesScreen: React.FC<HeroesScreenMessage> = (data: HeroesScreenMessage) => {
    const { clearBackground, setBackgroundColor } = useBackground();
    const { sendCommand } = useAura();
    useBack();

    const { playVideo, stopVideo } = useVideo();
    const [heroFocused, setHeroFocused] = useState<boolean>(true);
    const [currentHero, setCurrentHero] = useState<number>(data.currentIndex);

    // Send previous/next operations to Aura
    const onKeyPressed = useCallback(
        (e: KeyEvent) => {
            switch (e.data.keyCode) {
                case KeyCode.KEY_LEFT:
                    heroFocused && sendCommand(AuraCommands.getAuraCommand(Operation.PREV));
                    break;
                case KeyCode.KEY_RIGHT:
                    heroFocused && sendCommand(AuraCommands.getAuraCommand(Operation.NEXT));
                    break;
                case KeyCode.KEY_UP:
                    !heroFocused && setHeroFocused(true);
                    break;
                case KeyCode.KEY_DOWN:
                    heroFocused && setHeroFocused(false);
                    break;
            }
        },
        [heroFocused, setHeroFocused, sendCommand],
    );
    useInput(onKeyPressed);

    // Handle Aura actions
    const actionsHandler = useCallback(
        (actions: ActionMessage[]) => {
            if (actions && actions.length > 0) {
                const hasNewIndex = actions[0].parameters?.newIndex !== undefined;
                const newIndex = actions[0]?.parameters?.newIndex;
                switch (actions[0].name) {
                    case 'LIVING_APP.NEXT':
                        setCurrentHero((old: number) => (hasNewIndex ? newIndex : (old + 1) % data.heroes.length));
                        break;
                    case 'LIVING_APP.PREVIOUS':
                        setCurrentHero((old: number) =>
                            hasNewIndex ? newIndex : (data.heroes.length + old - 1) % data.heroes.length,
                        );
                        break;
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [setCurrentHero],
    );
    useActions(actionsHandler);

    useEffect(() => {
        const videoUrl = data.heroes[currentHero].bgVideo;
        clearBackground();
        setBackgroundColor(data.heroes[currentHero].bgColor);

        if (videoUrl) {
            playVideo(videoUrl, true);
        } else {
            stopVideo();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentHero, clearBackground, setBackgroundColor, playVideo, stopVideo]);

    const goBack = useCallback(() => {
        sendCommand(AuraCommands.getBack());
    }, [sendCommand]);

    const goToVillains = useCallback(() => {
        sendCommand(AuraCommands.getAuraCommand(Operation.VILLAINS));
    }, [sendCommand]);

    return (
        <div id="heroes-wrapper">
            <h1 id="title"> {data.title} </h1>
            <HeroComponent hero={data.heroes[currentHero]} current={currentHero} focused={heroFocused} />
            <Footer>
                <Button id="back-button" text={data.options[0]} onClick={goBack} />
                <Button id="villains-button" text={data.options[1]} onClick={goToVillains} />
            </Footer>
        </div>
    );
};

export default screenReady(HeroesScreen);
