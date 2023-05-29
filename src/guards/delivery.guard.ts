import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from '../enums/http-codes.enum';
import { IDelivery } from '../interfaces/deliverme.interface';
import { check_delivery_unpaid_listing_is_unpaid, check_user_has_unpaid_listings, get_delivery_by_id } from '../repos/deliveries.repo';



export async function DeliveryExists(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const delivery_id = parseInt(request.params.delivery_id, 10);
  const delivery_model: IDelivery | null = await get_delivery_by_id(delivery_id);
  if (!delivery_model) {
    return response.status(HttpStatusCode.NOT_FOUND).json({
      message: `Delivery not found`
    });
  }
  response.locals.delivery_model = delivery_model;
  return next();
}

export async function IsDeliveryOwner(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const delivery_model = <IDelivery> response.locals.delivery_model;
  const isOwner: boolean = response.locals.you.id === delivery_model.owner_id;
  if (!isOwner) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Not delivery owner`
    });
  }
  return next();
}

export async function IsNotDeliveryOwner(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const delivery_model = <IDelivery> response.locals.delivery_model;
  const isOwner: boolean = response.locals.you.id === delivery_model.owner_id;
  if (isOwner) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Is delivery owner`
    });
  }
  return next();
}

export async function IsDeliveryCarrier(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const delivery_model = <IDelivery> response.locals.delivery_model;
  const isCarrier: boolean = response.locals.you.id === delivery_model.carrier_id;
  if (!isCarrier) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Not delivery carrier`
    });
  }
  return next();
}

export async function IsDeliveryOwnerOrCarrier(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const delivery_model = <IDelivery> response.locals.delivery_model;
  const isOwner: boolean = response.locals.you.id === delivery_model.owner_id;
  const isCarrier: boolean = response.locals.you.id === delivery_model.carrier_id;
  const isEither = isOwner || isCarrier;
  if (!isEither) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Not delivery owner or carrier`
    });
  }
  return next();
}

export async function DeliveryIsCompleted(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const delivery_model = <IDelivery> response.locals.delivery_model;
  if (!delivery_model.completed) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Delivery not completed yet`
    });
  }
  return next();
}

export async function DeliveryNotCompleted(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const delivery_model = <IDelivery> response.locals.delivery_model;
  if (delivery_model.completed) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Delivery already completed`
    });
  }
  return next();
}

export async function DeliveryHasNoCarrierAssigned(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const delivery_model = <IDelivery> response.locals.delivery_model;
  if (delivery_model.carrier_id) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Delivery has carrier assigned`
    });
  }
  return next();
}

export async function IsDeliveryCarrierLocationRequestCompleted(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const delivery_model = <IDelivery> response.locals.delivery_model;
  if (!delivery_model.carrier_location_request_completed) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Delivery carrier location request is not completed`
    });
  }
  return next();
}

export async function IsNotDeliveryCarrierLocationRequestCompleted(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const delivery_model = <IDelivery> response.locals.delivery_model;
  if (delivery_model.carrier_location_request_completed) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Delivery carrier location request is already completed`
    });
  }
  return next();
}


export async function DeliveryIsNotUnpaid(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const delivery_id = parseInt(request.params.delivery_id, 10);
  const unpaid_listing = await check_delivery_unpaid_listing_is_unpaid(delivery_id);

  if (unpaid_listing) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Error: Delivery listing is unpaid`,
      data: {
        unpaid_listing
      }
    });
  }
  
  return next();
}


export async function UserDoesNotHaveAnUnpaidListing(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const unpaid_listing = await check_user_has_unpaid_listings(response.locals.you.id);

  if (unpaid_listing) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Error: User has unpaid listing`,
      data: {
        unpaid_listing
      }
    });
  }
  
  return next();
}

