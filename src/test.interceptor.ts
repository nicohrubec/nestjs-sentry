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
export class TestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    delay(250);
    Sentry.startSpan({ name: 'test-span-before' }, () => {});

    return next.handle().pipe(
      tap(() => {
        const now_2 = Date.now();
        delay(250);
        console.log(`After... ${Date.now() - now_2}ms`);
        Sentry.startSpan({ name: 'test-span-after-2' }, () => {});
      }),
    );
  }
}
