/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { antwortenDto } from '../models/antwortenDto';
import type { AntwortenFromAufgabe } from '../models/AntwortenFromAufgabe';
import type { AntwortTokenStamp } from '../models/AntwortTokenStamp';
import type { Aset } from '../models/Aset';
import type { aufgabenDto } from '../models/aufgabenDto';
import type { AufgabeStamp } from '../models/AufgabeStamp';
import type { IGetAllSpposResult } from '../models/IGetAllSpposResult';
import type { IGetPresetOrtTagResult } from '../models/IGetPresetOrtTagResult';
import type { IGetPresetTagsResult } from '../models/IGetPresetTagsResult';
import type { ISelectAllAufgabenResult } from '../models/ISelectAllAufgabenResult';
import type { ISelectAllTeamsResult } from '../models/ISelectAllTeamsResult';
import type { ISelectAufgabenFromSetResult } from '../models/ISelectAufgabenFromSetResult';
import type { ISelectAufgabenResult } from '../models/ISelectAufgabenResult';
import type { ISelectAufgabenSetResult } from '../models/ISelectAufgabenSetResult';
import type { ISelectAusbildungResult } from '../models/ISelectAusbildungResult';
import type { ISelectErhebungsartenResult } from '../models/ISelectErhebungsartenResult';
import type { ISelectInfErhebungenResult } from '../models/ISelectInfErhebungenResult';
import type { ISelectMatchingTokensResult } from '../models/ISelectMatchingTokensResult';
import type { ISelectOrtAufgabeResult } from '../models/ISelectOrtAufgabeResult';
import type { ISelectOrtTagsResult } from '../models/ISelectOrtTagsResult';
import type { ISelectPhaenBerResult } from '../models/ISelectPhaenBerResult';
import type { ISelectPhaenResult } from '../models/ISelectPhaenResult';
import type { ISelectSatzResult } from '../models/ISelectSatzResult';
import type { ISelectSingleGenResult } from '../models/ISelectSingleGenResult';
import type { ISelectSinglePhaenResult } from '../models/ISelectSinglePhaenResult';
import type { ISelectTagByIdResult } from '../models/ISelectTagByIdResult';
import type { ISelectTagByPhaenResult } from '../models/ISelectTagByPhaenResult';
import type { ISelectTagsLayersResult } from '../models/ISelectTagsLayersResult';
import type { phaenDto } from '../models/phaenDto';
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
            path: `/tags/id/${tagId}`,
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
     * @returns IGetAllSpposResult Ok
     * @throws ApiError
     */
    public static async getAllSppos(): Promise<Array<IGetAllSpposResult>> {
        const result = await __request({
            method: 'GET',
            path: `/tags/sppos`,
        });
        return result.body;
    }

    /**
     * @returns IGetPresetTagsResult Ok
     * @throws ApiError
     */
    public static async getPresetTags(): Promise<Array<IGetPresetTagsResult>> {
        const result = await __request({
            method: 'GET',
            path: `/tags/preset`,
        });
        return result.body;
    }

    /**
     * @param requestBody
     * @returns ISelectOrtTagsResult Ok
     * @throws ApiError
     */
    public static async getTagsFromPreset(
        requestBody: tagDto,
    ): Promise<Array<ISelectOrtTagsResult>> {
        const result = await __request({
            method: 'POST',
            path: `/tags/preset`,
            body: requestBody,
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
        requestBody: Array<tagDto>,
    ): Promise<Array<ISelectOrtTagsResult>> {
        const result = await __request({
            method: 'POST',
            path: `/tags/ort`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * @param tagId
     * @returns IGetPresetOrtTagResult Ok
     * @throws ApiError
     */
    public static async getPresetOrte(
        tagId: number,
    ): Promise<Array<IGetPresetOrtTagResult>> {
        const result = await __request({
            method: 'GET',
            path: `/tags/preset/ort/${tagId}`,
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
     * @returns ISelectTagByPhaenResult Ok
     * @throws ApiError
     */
    public static async getTagsByPhaen(
        requestBody: phaenDto,
    ): Promise<Array<ISelectTagByPhaenResult>> {
        const result = await __request({
            method: 'POST',
            path: `/phaen/tags`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * @param requestBody
     * @returns Aset Ok
     * @throws ApiError
     */
    public static async getASetByPhaen(
        requestBody: phaenDto,
    ): Promise<Array<Aset>> {
        const result = await __request({
            method: 'POST',
            path: `/phaen/aset`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * @param sid
     * @param aid
     * @returns AntwortenFromAufgabe Ok
     * @throws ApiError
     */
    public static async getAntbyAufgaben(
        sid?: number,
        aid?: number,
    ): Promise<Array<AntwortenFromAufgabe>> {
        const result = await __request({
            method: 'GET',
            path: `/antworten`,
            query: {
                'sid': sid,
                'aid': aid,
            },
        });
        return result.body;
    }

    /**
     * @param requestBody
     * @returns AntwortTokenStamp Ok
     * @throws ApiError
     */
    public static async getAntByTags(
        requestBody: Array<antwortenDto>,
    ): Promise<Array<AntwortTokenStamp>> {
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

    /**
     * @param o
     * @param p
     * @param l
     * @returns ISelectMatchingTokensResult Ok
     * @throws ApiError
     */
    public static async getMatchingTokens(
        o?: string,
        p?: string,
        l?: string,
    ): Promise<Array<ISelectMatchingTokensResult>> {
        const result = await __request({
            method: 'GET',
            path: `/antworten/token`,
            query: {
                'o': o,
                'p': p,
                'l': l,
            },
        });
        return result.body;
    }

    /**
     * @returns ISelectErhebungsartenResult Ok
     * @throws ApiError
     */
    public static async getErhebungsArten(): Promise<Array<ISelectErhebungsartenResult>> {
        const result = await __request({
            method: 'GET',
            path: `/antworten/arten`,
        });
        return result.body;
    }

    /**
     * @param erh
     * @param osm
     * @returns ISelectInfErhebungenResult Ok
     * @throws ApiError
     */
    public static async getInfErhebungen(
        erh: number,
        osm: number,
    ): Promise<Array<ISelectInfErhebungenResult>> {
        const result = await __request({
            method: 'GET',
            path: `/antworten/inferh`,
            query: {
                'erh': erh,
                'osm': osm,
            },
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
     * @returns ISelectAllTeamsResult Ok
     * @throws ApiError
     */
    public static async getAllTeams(): Promise<Array<ISelectAllTeamsResult>> {
        const result = await __request({
            method: 'GET',
            path: `/aufgaben/teams`,
        });
        return result.body;
    }

    /**
     * @param requestBody
     * @returns ISelectOrtAufgabeResult Ok
     * @throws ApiError
     */
    public static async getAufgabenOrte(
        requestBody: aufgabenDto,
    ): Promise<Array<ISelectOrtAufgabeResult>> {
        const result = await __request({
            method: 'POST',
            path: `/aufgaben/orte`,
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
     * @returns AufgabeStamp Ok
     * @throws ApiError
     */
    public static async getAntAudioByOrt(
        requestBody: antwortenDto,
    ): Promise<Array<AufgabeStamp>> {
        const result = await __request({
            method: 'POST',
            path: `/aufgaben/audio`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * @returns ISelectAusbildungResult Ok
     * @throws ApiError
     */
    public static async getAllAusbildung(): Promise<Array<ISelectAusbildungResult>> {
        const result = await __request({
            method: 'GET',
            path: `/social/berufe`,
        });
        return result.body;
    }

}