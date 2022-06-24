import { Transform } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';
import { StatusCodes } from 'http-status-codes';

/**
 * Error content, present in the response when an error is thrown
 */
export interface ErrorRO {
  statusCode: StatusCodes;
  message: string;
}

/**
 * Extend a Query from PaginatedQuery to add pageSize and pageNumber to it
 */
export class PaginatedQuery {
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  pageSize!: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(0)
  pageNumber!: number;

  /**
   * Return filters to add to prisma query to apply pagination
   */
  getPrismaPaginationFilters() {
    return {
      take: this.pageSize,
      skip: this.pageNumber * this.pageSize,
    };
  }
}
