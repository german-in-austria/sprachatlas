/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { numberArray } from './numberArray';

export type TagTree = {
    tagId: number;
    tagAbbrev: string;
    tagGene: number | null;
    tagName: string | null;
    tagComment: string | null;
    tagOrder: number | null;
    phenomenId: number | null;
    phenomenName: string;
    tagEbeneName: string;
    tagEbeneId: number;
    childrenIds: (numberArray) | null;
    parentIds: (numberArray) | null;
    children: Array<TagTree>;
}
