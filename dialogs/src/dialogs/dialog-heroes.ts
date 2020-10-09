import * as sdk from '@telefonica/la-bot-sdk';
import { DialogTurnResult, WaterfallStep, WaterfallStepContext, Choice } from 'botbuilder-dialogs';

import { DialogId, LIBRARY_NAME, Intent, HeroesScreenMessage, Screen, Operation, SessionData } from '../models';
import { ApiClient } from '../clients/api-client';

/* dialog Heroes child of HOME */

export default class HeroesDialog extends sdk.Dialog {
    static readonly dialogPrompt = `${DialogId.HEROES}-prompt`;

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
            options: ['Go Back', 'Go to Villains'],
            currentIndex: index,
            heroes,
        };

        // answer for the webapp
        const message = new sdk.ScreenMessage(Screen.HEROES, screenData);

        await sdk.messaging.send(stepContext, message);

        const choices: (Choice | string)[] = [
            {
                value: Operation.BACK,
                synonyms: [],
            },
            {
                value: Operation.NEXT,
                synonyms: [],
            },
            {
                value: Operation.PREV,
                synonyms: [],
            },
            {
                value: Intent.VILLAINS,
                synonyms: [],
            },
        ];
        return await sdk.messaging.prompt(stepContext, HeroesDialog.dialogPrompt, choices);
    }

    private async _promptResponse(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        const cases: sdk.PromptCase[] = [
            {
                operation: { value: Operation.BACK, synonyms: [] },
                action: [sdk.RouteAction.REPLACE, DialogId.HOME],
            },
            {
                operation: { value: Operation.NEXT, synonyms: [] }, // next
                logic: async () => {
                    const sessionData = await sdk.lifecycle.getSessionData<SessionData>(stepContext);
                    sessionData.currentIndex++;
                },
            },
            {
                operation: { value: Operation.PREV, synonyms: [] }, // prev
                logic: async () => {
                    const sessionData = await sdk.lifecycle.getSessionData<SessionData>(stepContext);
                    sessionData.currentIndex--;
                },
            },
            {
                operation: { value: Intent.VILLAINS, synonyms: [] }, // go Villains
                action: [sdk.RouteAction.REPLACE, DialogId.VILLAINS], // replace dialogId
            },
        ];

        return super.promptHandler(stepContext, cases);
    }

    private _sanitize(index: number, length: number): number {
        return (index + length * (Math.trunc(Math.abs(index) / length) + 1)) % length;
    }
}
