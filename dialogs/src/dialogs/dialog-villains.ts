import * as sdk from '@telefonica/la-bot-sdk';
import { DialogTurnResult, WaterfallStep, WaterfallStepContext } from 'botbuilder-dialogs';

import { ApiClient } from '../clients/api-client';
import { DialogId, LIBRARY_NAME, VillainsScreenMessage, Screen, Operation } from '../models';

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
            currentIndex: 0,
            villains,
            suggestions: [
                {
                    title: 'BACK',
                    intent: Operation.BACK,
                    entities: {},
                },
                {
                    title: 'GO TO HEROES',
                    intent: Operation.HEROES,
                    entities: {},
                },
            ],
        };

        // answer for the webapp
        const message = new sdk.ScreenMessage(Screen.VILLAINS, screenData);

        await sdk.messaging.send(stepContext, message);

        return await sdk.messaging.prompt(
            stepContext,
            VillainsDialog.dialogPrompt,
            this.cases.map((el) => el.operation),
        );
    }

    private cases: sdk.PromptCase[] = [
        {
            operation: { value: Operation.BACK, synonyms: ['volver'] },
            action: [sdk.RouteAction.REPLACE, DialogId.HOME],
        },
        {
            operation: { value: Operation.HEROES, synonyms: ['héroes'] }, // go Heroes
            action: [sdk.RouteAction.REPLACE, DialogId.HEROES], // replace dialogId
        },
    ];

    private async _promptResponse(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        return super.promptHandler(stepContext, this.cases);
    }
}
