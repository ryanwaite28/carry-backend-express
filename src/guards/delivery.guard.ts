import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../enums/http-codes.enum";
import { IDelivery } from "../interfaces/deliverme.interface";
import {
  check_delivery_unpaid_listing_is_unpaid,
  check_user_has_unpaid_listings,
  get_delivery_by_id,
  exists_delivery_by_id,
  delivery_has_at_lease_one_pending_carrier_request,
  check_carrier_delivery_request,
  check_carrier_delivery_request_pending,
  get_carrier_delivery_request_by_id,
  delivery_has_an_accepted_carrier_request,
  get_user_delivering_inprogress_count,
  get_carrier_requests_pending_all,
} from "../repos/deliveries.repo";
import { STATUSES } from "src/enums/common.enum";




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

export async function DeliveryExistsSlim(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const delivery_id = parseInt(request.params.delivery_id, 10);
  const exists: boolean = await exists_delivery_by_id(delivery_id);
  if (!exists) {
    return response.status(HttpStatusCode.NOT_FOUND).json({
      message: `Delivery not found`
    });
  }

  return next();
}

export async function DeliveryHasAssignedCarrier(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const delivery_model = <IDelivery> response.locals.delivery_model;
  if (!delivery_model.carrier_id) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Delivery does not have a carrier assigned`
    });
  }
  return next();
}

export async function DeliveryHasNoAssignedCarrier(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const delivery_model = <IDelivery> response.locals.delivery_model;
  if (!!delivery_model.carrier_id) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Delivery has a carrier assigned`
    });
  }
  return next();
}

export async function DeliveryHasNoPendingCarrierRequests(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const delivery_model = <IDelivery> response.locals.delivery_model;
  const pending_request = await delivery_has_at_lease_one_pending_carrier_request(delivery_model.id);
  if (!!pending_request) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Delivery has a pending carrier request`
    });
  }
  return next();
}

export async function CarrierHasNoPendingDeliveryRequest(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const delivery_model = <IDelivery> response.locals.delivery_model;
  const pending_request = await check_carrier_delivery_request_pending(delivery_model.id, response.locals.you.id);
  // console.log({ pending_request });
  if (!!pending_request) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Already sent request`
    });
  }
  return next();
}

export async function CarrierIsBelowCarryingLimit(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const delivering_inprogress_count = await get_user_delivering_inprogress_count(response.locals.you.id);
  if (delivering_inprogress_count === 3) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Cannot request a delivery while already carrying the max allowed at a time (3).`
    });
  }
  
  return next();
}

export async function CarrierIsBelowPendingRequestsLimit(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const pending_requests = await get_carrier_requests_pending_all(response.locals.you.id);
  if (pending_requests.length === 3) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Cannot request a delivery while already at the max allowed pending requests (3).`
    });
  }
  
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

export async function NoCustomerRating(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const delivery_model = <IDelivery> response.locals.delivery_model;
  const hasCustomerRating: boolean = !!delivery_model.customer_rating;
  if (hasCustomerRating) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Already rated`
    });
  }
  return next();
}

export async function NoCarrierRating(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const delivery_model = <IDelivery> response.locals.delivery_model;
  const hasCarrierRating: boolean = !!delivery_model.carrier_rating;
  if (hasCarrierRating) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Already rated`
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


export async function DeliveryHasNoAcceptedRequests(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const delivery_id = parseInt(request.params.delivery_id, 10);
  const delivery_carrier_request = await delivery_has_an_accepted_carrier_request(delivery_id);

  if (!!delivery_carrier_request) {
    return response.status(HttpStatusCode.NOT_FOUND).json({
      message: `Delivery already accepted a carrier request`
    });
  }
  
  response.locals.delivery_carrier_request = delivery_carrier_request
  return next();
}

export async function DeliveryCarrierRequestExists(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const carrier_request_id = parseInt(request.params.carrier_request_id, 10);
  const delivery_carrier_request = await get_carrier_delivery_request_by_id(carrier_request_id);

  if (!delivery_carrier_request) {
    return response.status(HttpStatusCode.NOT_FOUND).json({
      message: `Carrier Request not found`
    });
  }
  
  response.locals.delivery_carrier_request = delivery_carrier_request
  return next();
}

export async function DeliveryCarrierRequestExistsAndIsPending(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const carrier_request_id = parseInt(request.params.carrier_request_id, 10);
  const delivery_carrier_request = await get_carrier_delivery_request_by_id(carrier_request_id);

  if (!delivery_carrier_request) {
    return response.status(HttpStatusCode.NOT_FOUND).json({
      message: `Carrier Request not found`
    });
  }

  const isPending = delivery_carrier_request.status === STATUSES.PENDING;
  if (!isPending) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Carrier Request is not pending`
    });
  }
  
  response.locals.delivery_carrier_request = delivery_carrier_request
  return next();
}

export async function IsDeliveryOwnerOfDeliveryCarrierRequest(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const isCarrierRequester = response.locals.delivery_model.owner_id === response.locals.you.id;

  if (!isCarrierRequester) {
    return response.status(HttpStatusCode.NOT_FOUND).json({
      message: `Not delivery owner`
    });
  }
  
  return next();
}

export async function IsRequestingCarrier(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const isCarrierRequester = response.locals.delivery_carrier_request.user_id === response.locals.you.id;

  if (!isCarrierRequester) {
    return response.status(HttpStatusCode.NOT_FOUND).json({
      message: `Not requesting carrier`
    });
  }
  
  return next();
}

export async function RequestingCarrierIsBelow(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const isCarrierRequester = response.locals.delivery_carrier_request.user_id === response.locals.you.id;

  if (!isCarrierRequester) {
    return response.status(HttpStatusCode.NOT_FOUND).json({
      message: `Not requesting carrier`
    });
  }
  
  return next();
}

