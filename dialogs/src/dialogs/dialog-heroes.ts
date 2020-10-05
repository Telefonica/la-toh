import { Configuration, Dialog, PromptCase, RouteAction, ScreenMessage } from '@telefonica/la-bot-sdk';
import { ApiClient } from '../clients/api-client';
import * as sdk from '@telefonica/la-bot-sdk';
import { DialogTurnResult, WaterfallStep, WaterfallStepContext } from 'botbuilder-dialogs';
import { DialogId, LIBRARY_NAME, Intent, HeroesScreenMessage, Screen } from '../models';

/* dialog Heroes child of HOME */

export default class HeroesDialog extends Dialog {
    static readonly dialogPrompt = `${DialogId.HEROES}-prompt`;

    constructor(config: Configuration) {
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
            heroes,
        };

        // answer for the webapp
        const message = new ScreenMessage(Screen.HEROES, screenData);

        await sdk.messaging.send(stepContext, message);
        // user choices operations
        const choices: string[] = [
            Intent.BACK,
            Intent.VILLAINS, // go back
        ];
        return await sdk.messaging.prompt(stepContext, HeroesDialog.dialogPrompt, choices);
    }

    private async _promptResponse(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        const cases: PromptCase[] = [
            {
                operation: Intent.BACK, // go back
                action: [RouteAction.POP], // save this navigation in the routing
            },
            {
                operation: Intent.VILLAINS, // go Villains
                action: [RouteAction.REPLACE, DialogId.VILLAINS], // replace dialogId
            },
        ];

        return super.promptHandler(stepContext, cases);
    }
}
