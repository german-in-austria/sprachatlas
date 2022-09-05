/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { selectionObject } from './selectionObject';

export type antwortenDto = {
    ids: Array<number>;
    osmId: number;
    ageLower?: number;
    ageUpper?: number;
    ausbildung?: string;
    beruf_id?: number;
    weiblich?: boolean;
    group?: boolean;
    text?: Array<selectionObject>;
    ortho?: Array<selectionObject>;
    textInOrtho?: Array<selectionObject>;
    lemma?: Array<selectionObject>;
    phaen?: Array<number>;
}
