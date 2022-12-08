import { NextFunction, Request, Response } from 'express';
import { decodeJWT } from '../utils/helpers.utils';
import { HttpStatusCode } from '../enums/http-codes.enum';



export async function XSRF_PROTECTED(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const xsrf_token_cookie = request.cookies[`xsrf-token`];
  if (!xsrf_token_cookie) {
    return response.status(HttpStatusCode.BAD_REQUEST).json({
      message: `xsrf-token cookie not found on request.`
    });
  }

  const x_xsrf_token_header = request.headers[`x-xsrf-token`];
  if (!x_xsrf_token_header) {
    return response.status(HttpStatusCode.BAD_REQUEST).json({
      message: `x-xsrf-token header not found on request.`
    });
  }

  const match = xsrf_token_cookie === x_xsrf_token_header;
  if (!match) {
    return response.status(HttpStatusCode.BAD_REQUEST).json({
      message: `xsrf-token cookie and x-xsrf-token header does not match.`
    });
  }

  return next();
}

export async function XSRF_PROTECTED_2(
  request: Request,
  response: Response,
  next: NextFunction
) {
  /*  
    Because the cookies from this API are sent as SameSite=None, Secure, HttpOnly=False,
    JavaScript on clients cannot read it and thus cannot set the header.

    Instead, sent two cookies as a pair, one with a value and the other is the encryption of that first;
    if a request does have both cookies and does pass the decryption validation,
    the client is valid and sent the original cookies
  */
  const xsrf_token_a_cookie = request.cookies[`xsrf-token-a`];
  if (!xsrf_token_a_cookie) {
    return response.status(HttpStatusCode.BAD_REQUEST).json({
      message: `xsrf-token-a cookie not found on request.`
    });
  }

  const xsrf_token_b_cookie = request.cookies[`xsrf-token-b`];
  if (!xsrf_token_b_cookie) {
    return response.status(HttpStatusCode.BAD_REQUEST).json({
      message: `xsrf-token-b cookie not found on request.`
    });
  }

  const decrypted_cookie = decodeJWT(xsrf_token_b_cookie);
  const match = decrypted_cookie === xsrf_token_a_cookie;
  if (!match) {
    return response.status(HttpStatusCode.BAD_REQUEST).json({
      message: `xsrf-token cookies are invalid.`
    });
  }

  return next();
}