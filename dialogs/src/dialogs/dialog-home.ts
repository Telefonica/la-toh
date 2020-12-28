import { Configuration, Dialog, PromptCase, ScreenMessage } from '@telefonica/la-bot-sdk';
import * as sdk from '@telefonica/la-bot-sdk';
import { DialogTurnResult, WaterfallStep, WaterfallStepContext } from 'botbuilder-dialogs';

import { DialogId, LIBRARY_NAME, Screen, HomeScreenMessage, Operation } from '../models';

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

        return await sdk.messaging.prompt(
            stepContext,
            HomeDialog.dialogPrompt,
            this.cases.map((el) => el.operation),
        );
    }

    private cases: PromptCase[] = [
        {
            operation: { value: Operation.BACK, synonyms: ['volver'] },
            action: [sdk.RouteAction.CLOSE],
        },
        {
            operation: { value: Operation.HEROES, synonyms: ['héroes'] },
            action: [sdk.RouteAction.PUSH, DialogId.HEROES],
        },
        {
            operation: { value: Operation.VILLAINS, synonyms: ['villanos'] },
            action: [sdk.RouteAction.PUSH, DialogId.VILLAINS],
        },
    ];

    private async _promptResponse(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        return super.promptHandler(stepContext, this.cases);
    }
}
