import { StatusCodes } from 'http-status-codes';

/**
 * Inherit from this class to implement specific errors
 *
 * You can throw an implementation of ApiError from anywhere : the error middleware will catch it
 * and reply to the user with its HTTP code and message
 *
 * @example
 * class FileNotFoundError extends ApiError {
 *   constructor(path: str) {
 *     super(StatusCodes.NOT_FOUND, `File ${path} not found`);
 *   }
 * }
 *
 * throw new FileNotFoundError('./test'); // Will reply with a 404
 *
 */
export class ApiError extends Error {
  public statusCode: StatusCodes;

  constructor(statusCode: StatusCodes, msg: string) {
    super(`Api error : ${msg}`);
    this.statusCode = statusCode;
  }
}