/**
 * Basic interface representing a Response Object (RO), from which all ROs inherits
 * It may contain an error and enable API consumer to treat every response the same way
 */
export interface Ro {
  error?: {
    statusCode: number;
    message: string;
  };
}
