/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AntwortKontext } from './AntwortKontext';

export type AntwortToken = {
    start: any;
    stop: any;
    tagId: (number | Array<number>) | null;
    tagName: string | null;
    ortho: string | null;
    orthoText: string | null;
    text: string | null;
    phon: string | null;
    transcript: string | null;
    stdOrth: string | null;
    kontext: Array<AntwortKontext>;
    reihung: number;
}
