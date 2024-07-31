import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { delay, Observable } from 'rxjs';

@Injectable()
export class FetchGuard implements CanActivate {
  canActivate(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('Fetch guard ...');
    delay(500);
    fetch('http://example.com');
    return true;
  }
}
