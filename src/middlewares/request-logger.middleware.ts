import { NextFunction, Request, Response } from "express";
import { REQUESTS_FILE_LOGGER } from "src/utils/logger.utils";
import { dateTimeTransform } from "src/utils/carry.chamber";





export function RequestLoggerMiddleware(request: Request, response: Response, next: NextFunction) {
  const requestData = {
    timestamp: Date.now(),
    datetime: dateTimeTransform(new Date()),
    
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
  };

  console.log(`\n\n\n======= BEGIN RequestLoggerMiddleware =======`);
  console.log(requestData);
  console.log(`======= NEXT =======\n\n\n`);

  REQUESTS_FILE_LOGGER.info(`request data:`, {
    request: requestData
  });

  return next();
}