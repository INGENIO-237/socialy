import { Transform, Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class QueryOptions {
  @IsOptional()
  @IsPositive()
  page: number = 1;

  @IsOptional()
  @IsPositive()
  limit: number = 10;
}
