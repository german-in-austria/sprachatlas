/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type antwortenDto = {
    ids: Array<number>;
    osmId: number;
    ageLower?: number;
    ageUpper?: number;
    ausbildung?: string;
    beruf_id?: number;
    weiblich?: boolean;
    group?: boolean;
    text?: Array<string>;
    ortho?: Array<string>;
    textInOrtho?: Array<string>;
    lemma?: Array<string>;
}
