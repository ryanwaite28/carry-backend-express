import { NextFunction, Request, Response } from "express";


export function RequestLoggerMiddleware(request: Request, response: Response, next: NextFunction) {
  console.log(`request:`, {
    url: request.url
  });

  return next();
}