import * as sdk from '@telefonica/la-bot-sdk';
import { DialogTurnResult, WaterfallStep, WaterfallStepContext, Choice } from 'botbuilder-dialogs';

import { ApiClient } from '../clients/api-client';
import { DialogId, LIBRARY_NAME, HeroesScreenMessage, Screen, Operation, SessionData } from '../models';

/* dialog Heroes child of HOME */

export default class HeroesDialog extends sdk.Dialog {
    static readonly dialogPrompt = `${DialogId.HEROES}-prompt`;

    private choices: Record<string, Choice> = {
        [Operation.BACK]: {
            value: Operation.BACK,
            synonyms: ['atrás', 'volver'],
        },
        [Operation.NEXT]: {
            value: Operation.NEXT,
            synonyms: ['siguiente'],
        },
        [Operation.PREV]: {
            value: Operation.PREV,
            synonyms: ['anterior'],
        },
        [Operation.VILLAINS]: {
            value: Operation.VILLAINS,
            synonyms: ['villanos'],
        },
    };

    constructor(config: sdk.Configuration) {
        super(LIBRARY_NAME, DialogId.HEROES, config);
    }

    protected dialogStages(): WaterfallStep[] {
        return [this._dialogStage.bind(this), this._promptResponse.bind(this)];
    }

    protected prompts(): string[] {
        return [HeroesDialog.dialogPrompt];
    }

    protected async clearDialogState(stepContext: WaterfallStepContext): Promise<void> {
        const sessionData = await sdk.lifecycle.getSessionData<SessionData>(stepContext);
        delete sessionData.currentIndex;
    }

    private async _dialogStage(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        const sessionData = await sdk.lifecycle.getSessionData<SessionData>(stepContext);
        if (typeof sessionData.currentIndex === 'undefined') {
            sessionData.currentIndex = 0;
        }

        // instantiate the client
        const apiClient = new ApiClient(this.config, stepContext);

        // heroes data
        const heroes = await apiClient.getHeroes();

        // sanitize the index
        const index = this._sanitize(sessionData.currentIndex, heroes.length);

        const screenData: HeroesScreenMessage = {
            title: 'CHOOSE YOUR HERO!',
            currentIndex: index,
            heroes,
            suggestions: [
                {
                    title: 'BACK',
                    intent: Operation.BACK,
                    entities: {},
                },
                {
                    title: 'GO TO VILLAINS',
                    intent: Operation.VILLAINS,
                    entities: {},
                },
                {
                    title: 'NEXT',
                    intent: Operation.NEXT,
                    entities: {},
                },
                {
                    title: 'PREVIOUS',
                    intent: Operation.PREV,
                    entities: {},
                },
            ],
        };

        // answer for the webapp
        const message = new sdk.ScreenMessage(Screen.HEROES, screenData);

        await sdk.messaging.send(stepContext, message);

        return await sdk.messaging.prompt(stepContext, HeroesDialog.dialogPrompt, Object.values(this.choices));
    }

    private async _promptResponse(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        const cases: sdk.PromptCase[] = [
            {
                operation: this.choices[Operation.BACK],
                action: [sdk.RouteAction.REPLACE, DialogId.HOME],
            },
            {
                operation: this.choices[Operation.NEXT], // next
                logic: async () => {
                    const sessionData = await sdk.lifecycle.getSessionData<SessionData>(stepContext);
                    sessionData.currentIndex++;
                },
            },
            {
                operation: this.choices[Operation.PREV], // prev
                logic: async () => {
                    const sessionData = await sdk.lifecycle.getSessionData<SessionData>(stepContext);
                    sessionData.currentIndex--;
                },
            },
            {
                operation: this.choices[Operation.VILLAINS], // go Villains
                action: [sdk.RouteAction.REPLACE, DialogId.VILLAINS], // replace dialogId
            },
        ];

        return super.promptHandler(stepContext, cases);
    }

    private _sanitize(index: number, length: number): number {
        return (index + length * (Math.trunc(Math.abs(index) / length) + 1)) % length;
    }
}
