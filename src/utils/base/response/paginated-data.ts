import { PaginationMetadata } from "../pagination/dtos/pagination-metadata.dto";

export class PaginatedData<T> {
  data: T[];
  metadata: PaginationMetadata;
}
