import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse: any =
      exception instanceof BadRequestException
        ? exception.getResponse()['message']
        : null;
    let message = exception.message ?? 'Internal server error';
    if (exceptionResponse != null) {
      if (Array.isArray(exceptionResponse)) {
        message = exceptionResponse[0];
      } else {
        message = exceptionResponse;
      }
    }
    const prodErrorResponse: any = {
      statusCode,
      message,
    };
    response.status(statusCode).json(prodErrorResponse);
  }
}
