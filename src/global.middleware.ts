import { NextFunction, Request, Response } from 'express';

export function globalLogger(req: Request, res: Response, next: NextFunction) {
  console.log(`Global middleware...`);
  next();
}