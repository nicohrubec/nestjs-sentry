import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { delay } from './logger.middleware';
import * as Sentry from '@sentry/nestjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    const now = Date.now();
    delay(500);
    Sentry.startSpan({ name: 'test-span-before' }, () => {
      delay(10);
    });

    return next.handle().pipe(
      tap(() => {
        console.log(`After... ${Date.now() - now}ms`);
        const now_2 = Date.now();
        delay(500);
        console.log(`After... ${Date.now() - now_2}ms`);
        Sentry.startSpan({ name: 'test-span-after-1' }, () => {
          delay(10);
        });
      }),
    );
  }
}
