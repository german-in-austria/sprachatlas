/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Antwort } from './Antwort';
import type { AntwortToken } from './AntwortToken';

export type AntwortTokenStamp = {
    dateipfad: string | null;
    audiofile: string | null;
    gruppeBez: string | null;
    teamBez: string | null;
    data: Array<(Antwort | AntwortToken)>;
}
