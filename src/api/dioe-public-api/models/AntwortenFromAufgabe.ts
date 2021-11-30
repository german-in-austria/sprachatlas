/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AntwortTimestamp } from './AntwortTimestamp';

export type AntwortenFromAufgabe = {
    osmid: string | null;
    lat: string | null;
    lon: string | null;
    data: Array<AntwortTimestamp>;
}
