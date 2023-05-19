import { NextFunction, Request, Response } from "express";


export function RequestLoggerMiddleware(request: Request, response: Response, next: NextFunction) {
  console.log(`\n\n\n======= BEGIN RequestLoggerMiddleware =======`);
  console.log({
    url: request.url,
    method: request.method,
    body: request.body,
    headers: request.headers,
    raw_headers: request.rawHeaders,
    cookies: request.cookies,
    device: JSON.stringify(request['device']),
    params: request.params,
    query: request.query,
    signed_cookies: request.signedCookies,
  });
  console.log(`======= NEXT =======\n\n\n`);

  return next();
}