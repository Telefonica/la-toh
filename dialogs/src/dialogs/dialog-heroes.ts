import * as sdk from '@telefonica/la-bot-sdk';
import { DialogTurnResult, WaterfallStep, WaterfallStepContext, Choice } from 'botbuilder-dialogs';

import { DialogId, LIBRARY_NAME, Intent, HeroesScreenMessage, Screen, Operation } from '../models';
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected async clearDialogState(stepContext: WaterfallStepContext): Promise<void> {
        return;
    }

    private async _dialogStage(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        // instantiate the client
        const apiClient = new ApiClient(this.config, stepContext);

        // heroes data
        const heroes = await apiClient.getHeroes();

        const screenData: HeroesScreenMessage = {
            title: 'CHOOSE YOUR HERO!',
            options: ['Go Back', 'Go to Villains'],
            currentIndex: 0,
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
                action: [sdk.RouteAction.POP],
            },
            {
                operation: { value: Intent.VILLAINS, synonyms: [] }, // go Villains
                action: [sdk.RouteAction.REPLACE, DialogId.VILLAINS], // replace dialogId
            },
        ];

        return super.promptHandler(stepContext, cases);
    }
}
