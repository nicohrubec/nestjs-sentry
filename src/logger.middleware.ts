import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export function delay(ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    // Do nothing
  }
}

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`Function middleware...`);
  next();
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Class middleware...');
    delay(1000);
    fetch('http://example.com').then(() => {
      next();
    });
  }
}
