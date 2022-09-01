/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { selectionObject } from './selectionObject';

export type tagDto = {
    ids: Array<number>;
    para?: string;
    erhArt?: Array<number>;
    ausbildung?: string;
    beruf_id?: number;
    weiblich?: boolean;
    project?: number;
    group?: boolean;
    text?: Array<selectionObject>;
    ortho?: Array<selectionObject>;
    lemma?: Array<selectionObject>;
}
