/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { numberArray } from './numberArray';

export type TagTree = {
    childrenIds: (numberArray) | null;
    parentIds: (numberArray) | null;
    phenomenId: number | null;
    phenomenName: string;
    tagAbbrev: string;
    tagComment: string | null;
    tagEbeneId: number;
    tagEbeneName: string;
    tagGene: number | null;
    tagId: number;
    tagName: string | null;
    tagOrder: number | null;
    children: Array<TagTree>;
}
