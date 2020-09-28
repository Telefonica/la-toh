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
    HEROES = 'heroes',
    VILLAINS = 'villains',
}

export enum Intent {
    HOME = 'intent.la-toh.home',
    HEROES = 'intent.la-toh.heroes',
    VILLAINS = 'intent.la-toh.villains',
}

export enum Operation {
    BACK = 'intent.operation.sdk.back',
}

export enum Entity {
    MESSAGE = 'ent.message',
}

export enum CustomAction {}

export type ScreenMessage = {
    activeChannels: string[];
    screen: Screen | string;
    [key: string]: unknown;
};

export interface HomeScreenMessage {
    title: string;
    options: string[];
}

export interface HeroesScreenMessage {
    title: string;
    options: string[];
}

export interface VillainsScreenMessage {
    title: string;
    options: string[];
}
