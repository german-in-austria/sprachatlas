/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Aufgabe } from './Aufgabe';

export type Aset = {
    id: number;
    kuerzel: string;
    name: string;
    fokus: string;
    phaen: string;
    aufgaben: Array<Aufgabe>;
}
