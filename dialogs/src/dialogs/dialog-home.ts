import { Configuration, Dialog, PromptCase, ScreenMessage, RouteAction } from '@telefonica/la-bot-sdk';
import * as sdk from '@telefonica/la-bot-sdk';
import { DialogTurnResult, WaterfallStep, WaterfallStepContext } from 'botbuilder-dialogs';
import { DialogId, LIBRARY_NAME, Screen, SessionData, Intent, Entity, HomeScreenMessage } from '../models';

/*
This dialog is the parent of the heroes and villains dialogs
*/

export default class HomeDialog extends Dialog {
    static readonly dialogPrompt = `${DialogId.HOME}-prompt`;

    constructor(config: Configuration) {
        super(LIBRARY_NAME, DialogId.HOME, config);
    }

    protected dialogStages(): WaterfallStep[] {
        return [this._dialogStage.bind(this), this._promptResponse.bind(this)];
    }

    protected prompts(): string[] {
        return [HomeDialog.dialogPrompt];
    }

    /*
      method to clear the state of the dialogs, for example session data of a dialog
    */
    protected async clearDialogState(stepContext: WaterfallStepContext): Promise<void> {
        const sessionData = await sdk.lifecycle.getSessionData<SessionData>(stepContext);
        delete sessionData.name;
        return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private async _dialogStage(stepContext: WaterfallStepContext<any>): Promise<DialogTurnResult> {
        const screenData: HomeScreenMessage = {
            title: 'WELCOME TO THE TOUR OF HEROES!',
        };

        // answer for the webapp
        const message = new ScreenMessage(Screen.HOME, screenData);
        // send message to sdk
        await sdk.messaging.send(stepContext, message);

        // possible operations
        const choices: string[] = [
            Intent.HEROES, // go to heroes Dialog
            Intent.VILLAINS, // go to villains dialog
        ];

        return await sdk.messaging.prompt(stepContext, HomeDialog.dialogPrompt, choices);
    }

    private async _promptResponse(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        // session data from user
        const sessionData = await sdk.lifecycle.getSessionData<SessionData>(stepContext);

        // getting the persistent data from sdk
        const context = await sdk.persistence.getStoredData(stepContext);

        /*
            RouteAction.PUSH to control the navigation routing between dialogs
        */

        const cases: PromptCase[] = [
            {
                operation: Intent.VILLAINS,
                action: [RouteAction.PUSH, DialogId.VILLAINS],
            },
            {
                operation: Intent.HEROES,
                action: [RouteAction.PUSH, DialogId.HEROES],
            },
            {
                operation: Intent.NAME,
                // logic to do persitence sessionData
                logic: async () => {
                    const name = sdk.lifecycle.getCallingEntity(stepContext, Entity.NAME);
                    if (name) {
                        sessionData.name = name;
                        await sdk.persistence.storeData(stepContext, { ...context, name });
                    }
                },
            },
        ];

        return super.promptHandler(stepContext, cases);
    }
}
