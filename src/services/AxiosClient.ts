import axios, { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

import logger from '@services/logger';
import { beautifyJson } from '@utils/json';

export interface AxiosClientParams {
  baseURL: string;
  verbose?: boolean;
  throwsOnError?: boolean
  headers?: AxiosRequestHeaders
}

/**
 * Extend this class to have an axios requester customized
 *
 * @example
 * class RandomApiSdk extends AxiosClient {
 *   constructor(token: string) {
 *     super({
 *       baseURL: 'https://random.api',
 *       headers: {
 *         Authorization: token
 *       }
 *     })
 *   }
 *
 *   getRandomRessource(id: string) {
 *     return this.client.get<RandomResource>(`/random/${id}`);
 *   }
 * }
 */
export class AxiosClient {
  protected readonly client: AxiosInstance;

  /**
   * @constructor
   * @param baseURL Base URL for all requests
   * @param headers Custom headers set on every requests
   * @param verbose True to log every request payload / response data, false otherwise. Default to false
   * @param throwsOnError True to throw error on HTTP status codes 4XX and 5XX, false to treat it like a normal response. Default to true
   */
  constructor({ baseURL, headers = {}, verbose = false, throwsOnError = true }: AxiosClientParams) {
    this.client = axios.create({
      baseURL,
      validateStatus: (statusCode: number) => throwsOnError ? statusCode < 300 : true,
      headers,
    });

    this.client.interceptors.request.use((request: AxiosRequestConfig) => {
      logger.info(`[Request] ${request.method?.toUpperCase()} - ${new URL(request.url ?? '', request.baseURL)}`);

      if (verbose) {
        if (request.params) logger.debug(`[Request query params] ${beautifyJson(request.params)}`);
        if (request.data) console.debug(`[Request body] ${beautifyJson(request.data)}`);
      }
      return request;
    });

    this.client.interceptors.response.use((response) => {
      logger.info(`[Response] ${response.status} | ${response.statusText}`);

      if (verbose) {
        logger.debug(`[Error response data] ${beautifyJson(response.data)}`);
      }
      return response;
    }, (error) => {
      logger.info(`[Error response] ${error.response.status} | ${error.response.statusText}`);

      if (verbose) {
        logger.debug(`[Error response data] ${beautifyJson(error.response.data)}`);
      }
      return Promise.reject(error.response);
    });
  }
}
