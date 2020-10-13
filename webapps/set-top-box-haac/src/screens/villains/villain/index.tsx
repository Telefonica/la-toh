import './Villain.scss';
import { Villain } from '../../../../../../dialogs/src/models';
import { NavigableWrapper } from '@telefonica/la-web-sdk';
import React from 'react';

type VillainProps = {
    villain: Villain;
    current: number;
    onFocus: Function;
    defaultFocused: boolean;
};

export const VillainComponent: React.FC<VillainProps> = ({
    villain,
    current,
    onFocus,
    defaultFocused,
}: VillainProps) => {
    return (
        <NavigableWrapper
            defaultFocused={defaultFocused}
            focusedClass="focused"
            id={`villain-${current}`}
            onFocus={(e: Event) => onFocus(villain, e)}
        >
            <div className="villain-wrapper" style={{ color: villain.color || 'white' }}>
                <h1
                    style={{
                        textShadow: `10px 10px ${villain.secondaryColor || 'black'}, -10px -10px ${
                            villain.secondaryColor || 'black'
                        }`,
                    }}
                >
                    {villain.name}
                </h1>
                <img src={villain.icon} className="icon" alt="villain icon" />
                <div className="villain-info">
                    <ul>
                        <li>Superpowers: {villain.superPower}</li>
                        <li>Nemesis: {villain.nemesis}</li>
                    </ul>
                </div>
            </div>
        </NavigableWrapper>
    );
};
