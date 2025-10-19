import { Response } from './response';

export class ApiResponse<T> extends Response {
  data: T;
}
