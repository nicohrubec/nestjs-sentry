import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { delay } from './logger.middleware';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    const now = Date.now();
    delay(500);

    return next.handle().pipe(
      tap(() => console.log(`After... ${Date.now() - now}ms`)),
      tap(() => delay(500)),
    );
  }
}
