import { ApiClient as BaseApiClient, Configuration, HTTPMethod } from '@telefonica/la-bot-sdk';
import { WaterfallStepContext } from 'botbuilder-dialogs';
import { Hero, Villain } from '../models';

// mock data from jsons
import * as heroes from './mocks/heroes.json';
import * as villains from './mocks/villains.json';

export class ApiClient extends BaseApiClient {
    constructor(private readonly config: Configuration, stepContext: WaterfallStepContext) {
        super(stepContext, config.LA_TOH_API_MOCK);
    }
    // to obtain hero data
    async getHeroes(): Promise<Hero[]> {
        const url = `${this.config.LA_TOH_API_BASE_URL}${this.config.LA_TOH_API_GET_HEROES}`;
        const msg = 'Fetching Heroes from mock data';
        return this.setupRequest(HTTPMethod.GET, url, msg)
            .withMock(heroes)
            .withTimeout(10000)
            .execute<any>()
            .then((heroesObject) => heroesObject.heroes);
    }

    // to obtain villains data
    async getVillains(): Promise<Villain[]> {
        const url = `${this.config.LA_TOH_API_BASE_URL}${this.config.LA_TOH_API_GET_VILLAINS}`;
        const msg = 'Fetching Villains from mock data';
        return this.setupRequest(HTTPMethod.GET, url, msg)
            .withMock(villains)
            .withTimeout(10000)
            .execute<any>()
            .then((villainsObject) => villainsObject.villains);
    }
}
