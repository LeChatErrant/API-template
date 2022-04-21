/**
 * Basic interface representing a Response Object (RO), from which all ROs inherits
 * It may contain an error and enable API consumer to treat every response the same way
 */
import { Transform } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export interface Ro {
  error?: {
    statusCode: number;
    message: string;
  };
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
