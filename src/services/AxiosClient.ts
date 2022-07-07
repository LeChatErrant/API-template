import axios, { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import winston from 'winston';

import logger from '@services/logger';
import { beautifyJson } from '@utils/json';

/**
 * Axios client configuration
 */
export interface AxiosClientParams {
  baseURL?: string;
  verbose?: boolean;
  debug?: boolean;
  throwsOnError?: boolean
  headers?: AxiosRequestHeaders
  customLogger?: winston.Logger
}

/**
 * Extend this class to have a customized axios requester
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
 *   getRandomResource(id: string) {
 *     return this.client.get<RandomResource>(`/random/${id}`);
 *   }
 * }
 */
export class AxiosClient {
  protected readonly client: AxiosInstance;

  protected readonly logger: winston.Logger;

  /**
   * Return the underlying axios instance
   */
  public getClient() {
    return this.client;
  }

  /**
   * @constructor
   * @param baseURL Base URL for all requests
   * @param headers Custom headers set on every requests
   * @param verbose True to log requests and responses, false otherwise. Default to true
   * @param debug True to log every request payload / response data, false otherwise. Default to false
   * @param throwsOnError True to throw error on HTTP status codes 3XX, 4XX and 5XX, false to treat it like a normal response. Default to true
   * @param customLogger Custom logger to use for the requester
   */
  constructor({ baseURL, headers = {}, verbose = true, debug = false, throwsOnError = true, customLogger }: AxiosClientParams) {
    this.client = axios.create({
      baseURL,
      validateStatus: (statusCode: number) => throwsOnError ? statusCode < 300 : true,
      headers,
    });

    if (customLogger) {
      this.logger = customLogger;
    } else {
      this.logger = logger;
    }

    this.client.interceptors.request.use((request: AxiosRequestConfig) => {
      if (verbose || debug) {
        this.logger.info(`[Request] ${request.method?.toUpperCase()} - ${new URL(request.url ?? '', request.baseURL)}`);
      }

      if (debug) {
        if (request.params) this.logger.debug(`[Request query params] ${beautifyJson(request.params)}`);
        if (request.data) this.logger.debug(`[Request body] ${beautifyJson(request.data)}`);
      }
      return request;
    });

    this.client.interceptors.response.use((response) => {
      if (verbose || debug) {
        this.logger.info(`[Response] ${response.status} | ${response.statusText}`);
      }

      if (debug) {
        this.logger.debug(`[Response data] ${beautifyJson(response.data)}`);
      }
      return response;
    }, (error) => {
      if (verbose || debug) {
        if (error.response) {
          this.logger.error(`[Error response] ${error.response.status} | ${error.response.statusText}`);
        }
      }

      if (debug) {
        if (error.response) {
          this.logger.error(`[Error response data] ${beautifyJson(error.response.data)}`);
        }
      }
      if (error.response) {
        return Promise.reject(error.response.data);
      } else {
        return Promise.reject(error);
      }
    });
  }
}
