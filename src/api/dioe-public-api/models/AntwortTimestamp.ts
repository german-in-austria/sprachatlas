/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Antwort } from './Antwort';

export type AntwortTimestamp = {
    dateipfad: string | null;
    audiofile: string | null;
    gruppeBez: string | null;
    teamBez: string | null;
    data: Array<Antwort>;
}
