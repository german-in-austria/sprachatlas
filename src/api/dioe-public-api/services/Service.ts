/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { antwortenDto } from '../models/antwortenDto';
import type { AntwortenTags } from '../models/AntwortenTags';
import type { aufgabenDto } from '../models/aufgabenDto';
import type { ISelectAllAufgabenResult } from '../models/ISelectAllAufgabenResult';
import type { ISelectAufgabenFromSetResult } from '../models/ISelectAufgabenFromSetResult';
import type { ISelectAufgabenResult } from '../models/ISelectAufgabenResult';
import type { ISelectAufgabenSetResult } from '../models/ISelectAufgabenSetResult';
import type { ISelectOrtTagsResult } from '../models/ISelectOrtTagsResult';
import type { ISelectPhaenBerResult } from '../models/ISelectPhaenBerResult';
import type { ISelectPhaenResult } from '../models/ISelectPhaenResult';
import type { ISelectSatzResult } from '../models/ISelectSatzResult';
import type { ISelectSingleGenResult } from '../models/ISelectSingleGenResult';
import type { ISelectSinglePhaenResult } from '../models/ISelectSinglePhaenResult';
import type { ISelectTagByIdResult } from '../models/ISelectTagByIdResult';
import type { ISelectTagsLayersResult } from '../models/ISelectTagsLayersResult';
import type { tagDto } from '../models/tagDto';
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
     * @param tagId
     * @returns ISelectTagByIdResult Ok
     * @throws ApiError
     */
    public static async getTagById(
        tagId: number,
    ): Promise<Array<ISelectTagByIdResult>> {
        const result = await __request({
            method: 'GET',
            path: `/tags/${tagId}`,
        });
        return result.body;
    }

    /**
     * @param gen
     * @returns ISelectSingleGenResult Ok
     * @throws ApiError
     */
    public static async getTagGen(
        gen: number,
    ): Promise<Array<ISelectSingleGenResult>> {
        const result = await __request({
            method: 'GET',
            path: `/tags/gen`,
            query: {
                'gen': gen,
            },
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
     * @param requestBody
     * @returns ISelectOrtTagsResult Ok
     * @throws ApiError
     */
    public static async getTagOrteMultiple(
        requestBody: tagDto,
    ): Promise<Array<ISelectOrtTagsResult>> {
        const result = await __request({
            method: 'POST',
            path: `/tags/ort`,
            body: requestBody,
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
     * @returns ISelectAllAufgabenResult Ok
     * @throws ApiError
     */
    public static async getAllAufgaben(): Promise<Array<ISelectAllAufgabenResult>> {
        const result = await __request({
            method: 'GET',
            path: `/aufgaben`,
        });
        return result.body;
    }

    /**
     * @param requestBody
     * @returns ISelectAufgabenResult Ok
     * @throws ApiError
     */
    public static async getAufgabenPhaen(
        requestBody: aufgabenDto,
    ): Promise<Array<ISelectAufgabenResult>> {
        const result = await __request({
            method: 'POST',
            path: `/aufgaben`,
            body: requestBody,
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
     * @param requestBody
     * @returns ISelectAufgabenFromSetResult Ok
     * @throws ApiError
     */
    public static async getTagOrte1(
        requestBody: aufgabenDto,
    ): Promise<Array<ISelectAufgabenFromSetResult>> {
        const result = await __request({
            method: 'POST',
            path: `/aufgaben/setaufgabe`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * @param requestBody
     * @returns AntwortenTags Ok
     * @throws ApiError
     */
    public static async getAntByTags(
        requestBody: antwortenDto,
    ): Promise<Array<AntwortenTags>> {
        const result = await __request({
            method: 'POST',
            path: `/antworten/tags`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * @param q
     * @returns ISelectSatzResult Ok
     * @throws ApiError
     */
    public static async getSatz(
        q: string,
    ): Promise<Array<ISelectSatzResult>> {
        const result = await __request({
            method: 'GET',
            path: `/antworten/saetze`,
            query: {
                'q': q,
            },
        });
        return result.body;
    }

}