import { Suggestion } from '@telefonica/la-bot-sdk';

export const LIBRARY_NAME = 'la-toh';

export interface SessionData {
    sampleKey: string;
}

export enum DialogId {
    HOME = 'la-toh-home',
    VILLAINS = 'la-toh-villains',
    HEROES = 'la-toh-heroes',
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
}

export enum Operation {
    BACK = 'intent.operation.sdk.back',
    HEROES = 'intent.operation.la-toh.heroes',
    VILLAINS = 'intent.operation.la-toh.villains',
    NEXT = 'intent.operation.la-toh.next',
    PREV = 'intent.operation.la-toh.prev',
}

export enum Entity {
    MESSAGE = 'ent.message',
}

export type Hero = {
    name: string;
    realName: string;
    superpower: string;
    loveInterest: string;
    nemesis: string;
    group: string;
    icon: string;
    bgColor: string;
    color: string;
    secondaryColor: string;
    bgVideo?: string;
};

export interface Villain {
    name: string;
    nemesis: string;
    superPower: string;
    icon: string;
    bgColor: string;
    color: string;
    secondaryColor: string;
}

export enum CustomAction {}

export type ScreenMessage = NavigationMessage | ActionMessage;

export type NavigationMessage = {
    activeChannels: string[];
    screen: Screen | string;
    [key: string]: unknown;
};

export type ActionMessage = {
    name?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parameters?: Record<string, any>;
};

export interface HomeScreenMessage {
    title: string;
    suggestions: Suggestion[];
}

export interface HeroesScreenMessage {
    title: string;
    currentIndex: number;
    heroes: Hero[];
    suggestions: Suggestion[];
}

export interface VillainsScreenMessage {
    title: string;
    currentIndex: number;
    villains: Villain[];
    suggestions: Suggestion[];
}
