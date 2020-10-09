import { HomeScreenMessage, Intent } from './../models';
import { Operation } from './../models/index';
import { Configuration, Dialog, PromptCase, ScreenMessage } from '@telefonica/la-bot-sdk';
import * as sdk from '@telefonica/la-bot-sdk';
import { DialogTurnResult, WaterfallStep, WaterfallStepContext, Choice } from 'botbuilder-dialogs';
import { DialogId, LIBRARY_NAME, Screen } from '../models';

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

    protected async clearDialogState(stepContext: WaterfallStepContext): Promise<void> {
        return;
    }

    private async _dialogStage(stepContext: WaterfallStepContext<any>): Promise<DialogTurnResult> {
        const msg: HomeScreenMessage = {
            title: 'Welcome to the Tour of Heroes!',
            options: ['Go to Heroes', 'Go to Villains'],
        };

        await sdk.messaging.send(stepContext, new ScreenMessage(Screen.HOME, msg));

        const choices: (Choice | string)[] = [
            {
                value: Operation.BACK,
                synonyms: [],
            },
            {
                value: Intent.HEROES,
                synonyms: [],
            },
            {
                value: Intent.VILLAINS,
                synonyms: [],
            },
        ];

        return await sdk.messaging.prompt(stepContext, HomeDialog.dialogPrompt, choices);
    }

    private async _promptResponse(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        const cases: PromptCase[] = [
            {
                operation: { value: Operation.BACK, synonyms: [] },
                action: [sdk.RouteAction.CLOSE],
            },
            {
                operation: { value: Intent.HEROES, synonyms: [] },
                action: [sdk.RouteAction.PUSH, DialogId.HEROES],
            },
            {
                operation: { value: Intent.VILLAINS, synonyms: [] },
                action: [sdk.RouteAction.PUSH, DialogId.VILLAINS],
            },
        ];

        return super.promptHandler(stepContext, cases);
    }
}
