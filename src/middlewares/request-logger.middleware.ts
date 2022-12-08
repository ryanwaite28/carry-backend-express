import { NextFunction, Request, Response } from "express";


export function RequestLoggerMiddleware(request: Request, response: Response, next: NextFunction) {
  console.log(`request:`, {
    url: request.url,
    method: request.method,
    body: request.body,
    headers: request.headers,
    cookies: request.cookies,
    device: request['device'],
  });

  return next();
}