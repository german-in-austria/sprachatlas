/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Aufgabe } from './Aufgabe';

export type AufgabeStamp = {
    dateipfad: string | null;
    audiofile: string | null;
    gruppeBez: string | null;
    teamBez: string | null;
    data: Array<Aufgabe>;
    sigle: string;
    age: number;
}
