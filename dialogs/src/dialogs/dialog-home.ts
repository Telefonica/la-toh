import { Configuration, Dialog, PromptCase, ScreenMessage } from '@telefonica/la-bot-sdk';
import * as sdk from '@telefonica/la-bot-sdk';
import { DialogTurnResult, WaterfallStep, WaterfallStepContext, Choice } from 'botbuilder-dialogs';

import { DialogId, LIBRARY_NAME, Screen, HomeScreenMessage, Operation } from '../models';

export default class HomeDialog extends Dialog {
    static readonly dialogPrompt = `${DialogId.HOME}-prompt`;

    private choices: Record<string, Choice> = {
        [Operation.BACK]: {
            value: Operation.BACK,
            synonyms: ['atrás', 'volver'],
        },
        [Operation.HEROES]: {
            value: Operation.HEROES,
            synonyms: ['héroes'],
        },
        [Operation.VILLAINS]: {
            value: Operation.VILLAINS,
            synonyms: ['villanos'],
        },
    };

    constructor(config: Configuration) {
        super(LIBRARY_NAME, DialogId.HOME, config);
    }

    protected dialogStages(): WaterfallStep[] {
        return [this._dialogStage.bind(this), this._promptResponse.bind(this)];
    }

    protected prompts(): string[] {
        return [HomeDialog.dialogPrompt];
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected async clearDialogState(stepContext: WaterfallStepContext): Promise<void> {
        return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private async _dialogStage(stepContext: WaterfallStepContext<any>): Promise<DialogTurnResult> {
        const msg: HomeScreenMessage = {
            title: 'Welcome to the Tour of Heroes!',
            suggestions: [
                {
                    title: 'GO TO HEROES',
                    intent: Operation.HEROES,
                    entities: {},
                },
                {
                    title: 'GO TO VILLAINS',
                    intent: Operation.VILLAINS,
                    entities: {},
                },
            ],
        };

        await sdk.messaging.send(stepContext, new ScreenMessage(Screen.HOME, msg));

        return await sdk.messaging.prompt(stepContext, HomeDialog.dialogPrompt, Object.values(this.choices));
    }

    private async _promptResponse(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        const cases: PromptCase[] = [
            {
                operation: this.choices[Operation.BACK],
                action: [sdk.RouteAction.CLOSE],
            },
            {
                operation: this.choices[Operation.HEROES],
                action: [sdk.RouteAction.PUSH, DialogId.HEROES],
            },
            {
                operation: this.choices[Operation.VILLAINS],
                action: [sdk.RouteAction.PUSH, DialogId.VILLAINS],
            },
        ];

        return super.promptHandler(stepContext, cases);
    }
}
