import { HttpStatus } from '@nestjs/common';

export class Response {
  message: string;
  status?: HttpStatus = HttpStatus.OK;
}
