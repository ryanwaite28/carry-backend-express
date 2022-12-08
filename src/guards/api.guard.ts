import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from '../enums/http-codes.enum';
import { IDelivery } from '../interfaces/deliverme.interface';



export async function ApiIsDeliveryOwner(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const delivery_model = <IDelivery> response.locals.delivery_model;
  const isOwner: boolean = response.locals.api_key_model.user_id === delivery_model.owner_id;
  if (!isOwner) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Not delivery owner`
    });
  }
  return next();
}