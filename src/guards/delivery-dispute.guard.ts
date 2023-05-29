import { NextFunction, Request, Response } from 'express';
import { DeliveryDisputeStatus } from '../enums/carry.enum';
import { HttpStatusCode } from '../enums/http-codes.enum';
import { IUser } from '../interfaces/carry.interface';
import { IDeliveryDispute, IDeliveryDisputeSettlementOffer } from '../interfaces/deliverme.interface';
import { get_delivery_dispute_by_delivery_id, get_delivery_dispute_info_by_delivery_id, get_open_delivery_dispute_settlement_offer_by_dispute_id } from '../repos/deliveries.repo';




export async function DeliveryDisputeExists(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const delivery_id = parseInt(request.params.delivery_id, 10);
  const delivery_dispute_model: IDeliveryDispute | null = await get_delivery_dispute_by_delivery_id(delivery_id);
  if (!delivery_dispute_model) {
    return response.status(HttpStatusCode.NOT_FOUND).json({
      message: `Delivery Dispute not found`
    });
  }
  response.locals.delivery_dispute_model = delivery_dispute_model;
  return next();
}

export async function DeliveryDisputeInfoExists(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const delivery_id = parseInt(request.params.delivery_id, 10);
  const delivery_dispute_model: IDeliveryDispute | null = await get_delivery_dispute_info_by_delivery_id(delivery_id);
  if (!delivery_dispute_model) {
    return response.status(HttpStatusCode.NOT_FOUND).json({
      message: `Delivery Dispute not found`
    });
  }
  response.locals.delivery_dispute_model = delivery_dispute_model;
  return next();
}

export async function DeliveryDisputeNotExists(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const delivery_id = parseInt(request.params.delivery_id, 10);
  const delivery_dispute_model: IDeliveryDispute | null = await get_delivery_dispute_info_by_delivery_id(delivery_id);
  if (!!delivery_dispute_model) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Delivery Dispute already created`,
      // data: delivery_dispute_model,
    });
  }

  return next();
}

export async function DeliveryDisputeExistsSlim(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const delivery_id = parseInt(request.params.delivery_id, 10);
  const delivery_dispute_model: IDeliveryDispute | null = await get_delivery_dispute_by_delivery_id(delivery_id);
  if (!delivery_dispute_model) {
    return response.status(HttpStatusCode.NOT_FOUND).json({
      message: `Delivery Dispute not found`
    });
  }
  response.locals.delivery_dispute_model = delivery_dispute_model;
  return next();
}

export async function DeliveryDisputeNotExistsSlim(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const delivery_id = parseInt(request.params.delivery_id, 10);
  const delivery_dispute_model: IDeliveryDispute | null = await get_delivery_dispute_by_delivery_id(delivery_id);
  if (!!delivery_dispute_model) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Delivery Dispute already created`,
      // data: delivery_dispute_model,
    });
  }

  return next();
}

export async function DeliveryDisputeStatusOpen(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const delivery_dispute_model: IDeliveryDispute = response.locals.delivery_dispute_model;
  if (delivery_dispute_model.status !== DeliveryDisputeStatus.OPEN) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Delivery Dispute not in open status`
    });
  }
  
  return next();
}

export async function DeliveryDisputeOpenSettlementNotExists(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const delivery_dispute_model: IDeliveryDispute = response.locals.delivery_dispute_model;
  const settlement_offer_model: IDeliveryDisputeSettlementOffer | null = await get_open_delivery_dispute_settlement_offer_by_dispute_id(delivery_dispute_model.id);

  if (!!settlement_offer_model) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Delivery Dispute Settlement already exists`,
      data: settlement_offer_model
    });
  }
  
  return next();
}

export async function DeliveryDisputeOpenSettlementExists(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const delivery_dispute_model: IDeliveryDispute = response.locals.delivery_dispute_model;
  const settlement_offer_model: IDeliveryDisputeSettlementOffer | null = await get_open_delivery_dispute_settlement_offer_by_dispute_id(delivery_dispute_model.id);

  if (!settlement_offer_model) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Delivery Dispute Open Settlement not found`
    });
  }
  
  response.locals.settlement_offer_model = settlement_offer_model;
  return next();
}

export async function IsSettlementOfferCreator(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const settlement_offer_model: IDeliveryDisputeSettlementOffer = response.locals.settlement_offer_model;
  const you: IUser = response.locals.you;
  
  const isCreator = settlement_offer_model.creator_id === you.id;

  if (!isCreator) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Cannot complete; Is not settlement creator`
    });
  }
  
  return next();
}

export async function IsNotSettlementOfferCreator(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const settlement_offer_model: IDeliveryDisputeSettlementOffer = response.locals.settlement_offer_model;
  const you: IUser = response.locals.you;
  
  const isCreator = settlement_offer_model.creator_id === you.id;

  if (isCreator) {
    return response.status(HttpStatusCode.FORBIDDEN).json({
      message: `Cannot complete; Is settlement creator`
    });
  }
  
  return next();
}
