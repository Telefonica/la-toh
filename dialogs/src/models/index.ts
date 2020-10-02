export const LIBRARY_NAME = 'la-toh';

export interface SessionData {
    name: string;
}

export enum DialogId {
    HOME = 'la-toh-home',
    VILLAINS = 'la-toh-villains',
    HEROES = 'la-toh-heroes',
}

export enum Screen {
    HOME = 'home',
    VILLAINS = 'villains',
    HEROES = 'heroes',
    ERROR = 'error',
    SPLASH = 'splash',
}

export enum Intent {
    HOME = 'intent.la-toh.home',
    VILLAINS = 'intent.la-toh.villains',
    HEROES = 'intent.la-toh.heroes',
    BACK = 'intent.la-toh.back',
    NAME = 'intent.la-toh.name',
}

export enum Operation {
    BACK = 'intent.operation.sdk.back',
}

export enum Entity {
    NAME = 'ent.name',
}

export enum CustomAction {}

export interface HomeScreenMessage {
    title: string;
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

export interface HeroesScreenMessage {
    title: string;
    heroes: Hero[];
}
