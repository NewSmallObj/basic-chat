import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { get } from 'lodash';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = (exception.getStatus && exception?.getStatus()) || 500;

    const data =
      (exception?.getResponse && exception?.getResponse()) || exception.message;

    if (status === 400 && typeof data === 'object') {
      const msgs = get(data, 'message', exception.message);
      const msg = Array.isArray(msgs) ? msgs.join(',') : msgs;
      response.status(200).json({
        code: status,
        msg,
      });
    } else {
      response.status(200).json({
        code: status,
        msg: data,
      });
    }
  }
}
