import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { delay } from './logger.middleware';

@Injectable()
export class FetchGuard implements CanActivate {
  async canActivate(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context: ExecutionContext,
  ) {
    console.log('Fetch guard ...');
    delay(500);
    await fetch('http://example.com');
    return true;
  }
}
