export const LIBRARY_NAME = 'la-toh';

export interface SessionData {
    sampleKey: string;
}

export enum DialogId {
    HOME = 'la-toh-home',
}

export enum Screen {
    HOME = 'home',
    ERROR = 'error',
    SPLASH = 'splash',
}

export enum Intent {
    HOME = 'intent.la-toh.home',
}

export enum Operation {
    BACK = 'intent.operation.sdk.back',
    HEROES = 'intent.operation.la-toh.heroes',
    VILLAINS = 'intent.operation.la-toh.villains',
}

export enum Entity {
    MESSAGE = 'ent.message',
}

export enum CustomAction {}

export interface HomeScreenMessage {
    title: string;
    options: string[];
}
