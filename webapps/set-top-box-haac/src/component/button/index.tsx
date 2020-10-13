import './Button.scss';

import { NavigableButton, NavigableWrapperProps } from '@telefonica/la-web-sdk';
import * as React from 'react';

interface ButtonProps extends NavigableWrapperProps {
    text: string;
    defaultClass?: string;
}

const Button: React.FC<ButtonProps> = ({ text, defaultClass, ...props }: ButtonProps) => {
    return (
        <NavigableButton
            {...props}
            defaultClass={defaultClass || 'button'}
            focusedClass={props.focusedClass || 'focused-button'}
        >
            {text}
        </NavigableButton>
    );
};

export default Button;
