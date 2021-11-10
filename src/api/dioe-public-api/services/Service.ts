/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { aufgabenDto } from '../models/aufgabenDto';
import type { ISelectAufgabenFromSetResult } from '../models/ISelectAufgabenFromSetResult';
import type { ISelectAufgabenResult } from '../models/ISelectAufgabenResult';
import type { ISelectAufgabenSetResult } from '../models/ISelectAufgabenSetResult';
import type { ISelectOrtTagsResult } from '../models/ISelectOrtTagsResult';
import type { ISelectPhaenBerResult } from '../models/ISelectPhaenBerResult';
import type { ISelectPhaenResult } from '../models/ISelectPhaenResult';
import type { ISelectSinglePhaenResult } from '../models/ISelectSinglePhaenResult';
import type { ISelectTagsLayersResult } from '../models/ISelectTagsLayersResult';
import type { TagTree } from '../models/TagTree';
import { request as __request } from '../core/request';

export class Service {

    /**
     * @returns TagTree Ok
     * @throws ApiError
     */
    public static async getTags(): Promise<Array<TagTree>> {
        const result = await __request({
            method: 'GET',
            path: `/tags`,
        });
        return result.body;
    }

    /**
     * @returns ISelectTagsLayersResult Ok
     * @throws ApiError
     */
    public static async getTagLayers(): Promise<Array<ISelectTagsLayersResult>> {
        const result = await __request({
            method: 'GET',
            path: `/tags/layers`,
        });
        return result.body;
    }

    /**
     * @param tagId
     * @returns ISelectOrtTagsResult Ok
     * @throws ApiError
     */
    public static async getTagOrte(
        tagId: number,
    ): Promise<Array<ISelectOrtTagsResult>> {
        const result = await __request({
            method: 'GET',
            path: `/tags/ort/${tagId}`,
        });
        return result.body;
    }

    /**
     * @param queryParam
     * @param something
     * @param requestBody
     * @returns any Ok
     * @throws ApiError
     */
    public static async getControllerDemo(
        queryParam: string,
        something: string,
        requestBody: any,
    ): Promise<{
        data: any,
        test: 'ok',
    }> {
        const result = await __request({
            method: 'POST',
            path: `/test/${something}`,
            query: {
                'query_param': queryParam,
            },
            body: requestBody,
        });
        return result.body;
    }

    /**
     * @returns ISelectPhaenBerResult Ok
     * @throws ApiError
     */
    public static async getPhaenBer(): Promise<Array<ISelectPhaenBerResult>> {
        const result = await __request({
            method: 'GET',
            path: `/phaen/ber`,
        });
        return result.body;
    }

    /**
     * @returns ISelectPhaenResult Ok
     * @throws ApiError
     */
    public static async getPhaen(): Promise<Array<ISelectPhaenResult>> {
        const result = await __request({
            method: 'GET',
            path: `/phaen`,
        });
        return result.body;
    }

    /**
     * @param berId
     * @returns ISelectSinglePhaenResult Ok
     * @throws ApiError
     */
    public static async getSinglePhaen(
        berId: number,
    ): Promise<Array<ISelectSinglePhaenResult>> {
        const result = await __request({
            method: 'GET',
            path: `/phaen/${berId}`,
        });
        return result.body;
    }

    /**
     * @param requestBody
     * @returns ISelectAufgabenSetResult Ok
     * @throws ApiError
     */
    public static async getAufgabenSets(
        requestBody: aufgabenDto,
    ): Promise<Array<ISelectAufgabenSetResult>> {
        const result = await __request({
            method: 'POST',
            path: `/aufgaben/sets`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * @returns ISelectAufgabenResult Ok
     * @throws ApiError
     */
    public static async getAufgabenPhaen(): Promise<Array<ISelectAufgabenResult>> {
        const result = await __request({
            method: 'POST',
            path: `/aufgaben`,
        });
        return result.body;
    }

    /**
     * @returns ISelectAufgabenFromSetResult Ok
     * @throws ApiError
     */
    public static async getTagOrte1(): Promise<Array<ISelectAufgabenFromSetResult>> {
        const result = await __request({
            method: 'POST',
            path: `/aufgaben/setaufgabe`,
        });
        return result.body;
    }

}