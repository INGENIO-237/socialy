import { PaginationMetadata } from "../pagination/dtos/pagination-metadata.dto";
import { Response } from "./response";

export class PaginatedApiResponse<T> extends Response {
    data: T[];
    metadata: PaginationMetadata
}