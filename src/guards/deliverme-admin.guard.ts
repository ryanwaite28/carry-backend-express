import { NextFunction, Request, Response } from 'express';
import { AuthorizeJWT } from 'src/utils/helpers.utils';



export function CarryAdminAuthorized(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const auth = AuthorizeJWT(request, true, (<string> process.env.JWT_DELIVERME_ADMIN_SECRET));
  if (auth.error) {
    return response.status(auth.status).json(auth);
  }
  response.locals.you = auth.you;
  return next();
}

export function CarryAdminAuthorizedSlim(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const auth = AuthorizeJWT(request, false, (<string> process.env.JWT_DELIVERME_ADMIN_SECRET));
  if (auth.error) {
    return response.status(auth.status).json(auth);
  }
  response.locals.you = auth.you;
  return next();
}