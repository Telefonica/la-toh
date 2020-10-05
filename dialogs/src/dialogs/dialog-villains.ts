import { Configuration, Dialog, PromptCase, RouteAction, ScreenMessage } from '@telefonica/la-bot-sdk';
import { ApiClient } from '../clients/api-client';
import * as sdk from '@telefonica/la-bot-sdk';
import { DialogTurnResult, WaterfallStep, WaterfallStepContext } from 'botbuilder-dialogs';
import { DialogId, LIBRARY_NAME, Intent, VillainsScreenMessage, Screen } from '../models';

/* dialog Villains child of HOME */

export default class VillainsDialog extends Dialog {
    static readonly dialogPrompt = `${DialogId.VILLAINS}-prompt`;

    constructor(config: Configuration) {
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
            villains,
        };

        // answer for the webapp
        const message = new ScreenMessage(Screen.VILLAINS, screenData);

        await sdk.messaging.send(stepContext, message);
        // user choices operations
        const choices: string[] = [
            Intent.BACK, // go back
            Intent.HEROES, // go to heroes
        ];
        return await sdk.messaging.prompt(stepContext, VillainsDialog.dialogPrompt, choices);
    }

    private async _promptResponse(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        const cases: PromptCase[] = [
            {
                operation: Intent.BACK, // go back
                action: [RouteAction.POP], // save this navigation in the routing
            },
            {
                operation: Intent.HEROES, // go to heroes
                action: [RouteAction.REPLACE, DialogId.HEROES], // replace dialogId
            },
        ];

        return super.promptHandler(stepContext, cases);
    }
}
