/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import axiosInstance from '../axios/axios';
import { IApiReturn, libConfig } from '../index'

import { SuccessResponse, ErrorResponse, applyLibConfig } from '../utils';

interface IApiQueryProps {
    method: Method,
    url: string,
    data?: any,
    page?: number,
    limit?: number,
    extraHeaders?: any
    debug?: boolean,
    transitional?: any,
    noNestedData?: boolean
    extraConfig?: AxiosRequestConfig
}

export const apiQuery = async <T = any>({
    method,
    url,
    data,
    page,
    limit,
    extraHeaders,
    debug = false,
    transitional,
    noNestedData,
    extraConfig
}: IApiQueryProps ): Promise<IApiReturn<T | undefined>> => {
    try {
        // eslint-disable-next-line prefer-const
        let config: AxiosRequestConfig = {
            url,
            method,
            params: {
                page,
                limit,
            },
            data: data,
            transitional: transitional !== undefined ? transitional : {
                'silentJSONParsing': true,
                'forcedJSONParsing': true,
                'clarifyTimeoutError': false
            }
        }

        if (extraConfig) {
            config = { ...config, ...extraConfig }
        }

        config = applyLibConfig(libConfig, config)


        if (extraHeaders) {
            config.headers = extraHeaders
        }
       
        const response: AxiosResponse = await axiosInstance(config);

        if (debug) {
            // eslint-disable-next-line no-console
            console.log('response config', config)
            // eslint-disable-next-line no-console
            console.log('response response', response)
        }

        return SuccessResponse({
            data: response,
            noNestedData: noNestedData
        })
    } catch (error) {
        if (error.isAxiosError && !error.response) {
            throw new Error('Network Error')
        }


        return ErrorResponse({
            error: { message: error.response?.data?.message, errors: error.response?.data?.errors },
            status: error.response?.status
        })
    }
}