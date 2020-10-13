import './Hero.scss';
import React from 'react';
import { NavigableWrapper } from '@telefonica/la-web-sdk';
import { Hero } from '../../../../../../dialogs/src/models';

type HeroProps = {
    hero: Hero;
    current: number;
    focused: boolean;
};

export const HeroComponent: React.FC<HeroProps> = ({ hero, current, focused }: HeroProps) => {
    return (
        <NavigableWrapper defaultFocused={focused} id={`hero-${current}`} focusedClass="focused">
            <div className="hero-wrapper" style={{ color: hero.color || 'white' }}>
                <img src={hero.icon} className="icon" alt="Hero icon" />
                <div className="hero-info">
                    <span
                        style={{
                            textShadow: `20px 20px ${hero.secondaryColor || 'black'}, -20px -20px ${
                                hero.secondaryColor || 'black'
                            }`,
                        }}
                    >
                        {hero.name}
                    </span>
                    <ul>
                        <li>Real name: {hero.realName}</li>
                        <li>Superpowers: {hero.superpower}</li>
                        <li>Love interest: {hero.loveInterest}</li>
                        <li>Nemesis: {hero.nemesis}</li>
                        <li>Group: {hero.group}</li>
                    </ul>
                </div>
            </div>
        </NavigableWrapper>
    );
};
