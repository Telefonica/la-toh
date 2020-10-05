import { ApiClient } from '../clients/api-client';
import * as sdk from '@telefonica/la-bot-sdk';
import { Choice, DialogTurnResult, WaterfallStep, WaterfallStepContext } from 'botbuilder-dialogs';
import { DialogId, LIBRARY_NAME, Intent, VillainsScreenMessage, Screen, Operation } from '../models';

/* dialog Villains child of HOME */

export default class VillainsDialog extends sdk.Dialog {
    static readonly dialogPrompt = `${DialogId.VILLAINS}-prompt`;

    constructor(config: sdk.Configuration) {
        super(LIBRARY_NAME, DialogId.VILLAINS, config);
    }

    protected dialogStages(): WaterfallStep[] {
        return [this._dialogStage.bind(this), this._promptResponse.bind(this)];
    }

    protected prompts(): string[] {
        return [VillainsDialog.dialogPrompt];
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected async clearDialogState(stepContext: WaterfallStepContext): Promise<void> {
        return;
    }

    private async _dialogStage(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        // instantiate the client
        const apiClient = new ApiClient(this.config, stepContext);

        // villains data
        const villains = await apiClient.getVillains();

        const screenData: VillainsScreenMessage = {
            title: 'CHOOSE YOUR VILLAIN!',
            options: ['Go back', 'Go to Heroes'],
            currentIndex: 0,
            villains,
        };

        // answer for the webapp
        const message = new sdk.ScreenMessage(Screen.VILLAINS, screenData);

        await sdk.messaging.send(stepContext, message);

        const choices: (Choice | string)[] = [
            {
                value: Operation.BACK,
                synonyms: [],
            },
            {
                value: Intent.HEROES,
                synonyms: [],
            },
        ];
        return await sdk.messaging.prompt(stepContext, VillainsDialog.dialogPrompt, choices);
    }

    private async _promptResponse(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        const cases: sdk.PromptCase[] = [
            {
                operation: { value: Operation.BACK, synonyms: [] },
                action: [sdk.RouteAction.POP],
            },
            {
                action: [sdk.RouteAction.REPLACE, DialogId.HEROES], // replace dialogId
                operation: { value: Intent.HEROES, synonyms: [] }, // go Heroes
            },
        ];

        return super.promptHandler(stepContext, cases);
    }
}
