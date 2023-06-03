import { Router } from 'express';
import { DeliveriesRequestHandler } from '../handlers/deliveries.handler';
import {
  DeliveryExists,
  IsDeliveryOwner,
  IsDeliveryCarrier,
  DeliveryIsCompleted,
  DeliveryNotCompleted,
  IsDeliveryCarrierLocationRequestCompleted,
  IsNotDeliveryCarrierLocationRequestCompleted,
  DeliveryHasNoCarrierAssigned,
  IsDeliveryOwnerOrCarrier,
  UserDoesNotHaveAnUnpaidListing,
} from '../guards/delivery.guard';
import {
  DeliveryDisputeExists,
  DeliveryDisputeInfoExists,
  DeliveryDisputeExistsSlim,
  DeliveryDisputeNotExists,
  DeliveryDisputeNotExistsSlim,
  DeliveryDisputeOpenSettlementExists,
  DeliveryDisputeOpenSettlementNotExists,
  DeliveryDisputeStatusOpen,
  IsSettlementOfferCreator,
  IsNotSettlementOfferCreator
} from "../guards/delivery-dispute.guard";
import { YouAuthorizedSlim, YouAuthorizedSlimWeak } from '../guards/you.guard';
import { ValidateRequestBodyDto } from 'src/middlewares/class-transformer-validator.middleware';
import { DeliveryRatingDto } from 'src/dto/rating.dto';


export const DeliveriesRouter: Router = Router({ mergeParams: true });

/** GET */


//dispute
DeliveriesRouter.get('/:delivery_id/dispute', DeliveryDisputeExists, DeliveriesRequestHandler.get_delivery_dispute_by_delivery_id);
DeliveriesRouter.get('/:delivery_id/dispute-info', DeliveryDisputeInfoExists, DeliveriesRequestHandler.get_delivery_dispute_info_by_delivery_id);
DeliveriesRouter.get('/:delivery_id/dispute-messages', YouAuthorizedSlim, DeliveryDisputeExists, DeliveriesRequestHandler.get_user_dispute_messages_by_user_id_and_dispute_id);

// search
DeliveriesRouter.get('/find-available-from/city/:city/state/:state', YouAuthorizedSlim, DeliveriesRequestHandler.find_available_delivery_by_from_city_and_state);
DeliveriesRouter.get('/find-available-to/city/:city/state/:state', YouAuthorizedSlim, DeliveriesRequestHandler.find_available_delivery_by_to_city_and_state);

DeliveriesRouter.get('/:delivery_id', DeliveryExists, DeliveriesRequestHandler.get_delivery_by_id);


/** POST */

DeliveriesRouter.post('/', YouAuthorizedSlim, UserDoesNotHaveAnUnpaidListing, DeliveriesRequestHandler.create_delivery);
DeliveriesRouter.post('/find-available', YouAuthorizedSlim, DeliveriesRequestHandler.find_available_delivery);
DeliveriesRouter.post('/search', YouAuthorizedSlimWeak, DeliveriesRequestHandler.search_deliveries);
DeliveriesRouter.post('/browse-recent', YouAuthorizedSlimWeak, DeliveriesRequestHandler.browse_recent_deliveries);
DeliveriesRouter.post('/browse-recent/:delivery_id', YouAuthorizedSlimWeak, DeliveriesRequestHandler.browse_recent_deliveries);
// DeliveriesRouter.post('/browse-featured', YouAuthorizedSlimWeak, DeliveriesRequestHandler.browse_featured_deliveries);
// DeliveriesRouter.post('/browse-featured/:delivery_id', YouAuthorizedSlimWeak, DeliveriesRequestHandler.browse_featured_deliveries);
DeliveriesRouter.post('/browse-map/swlat/:swlat/swlng/:swlng/nelat/:nelat/nelng/:nelng', YouAuthorizedSlimWeak, DeliveriesRequestHandler.browse_map_deliveries);

DeliveriesRouter.post('/:delivery_id/message', YouAuthorizedSlim, DeliveryExists, DeliveriesRequestHandler.send_delivery_message);
DeliveriesRouter.post('/:delivery_id/pay-carrier', YouAuthorizedSlim, DeliveryExists, IsDeliveryOwner, DeliveriesRequestHandler.pay_carrier_via_transfer);
DeliveriesRouter.post('/:delivery_id/carrier-self-pay', YouAuthorizedSlim, DeliveryExists, IsDeliveryCarrier, DeliveriesRequestHandler.carrier_self_pay);
DeliveriesRouter.post('/:delivery_id/payment-success', YouAuthorizedSlim, DeliveryExists, IsDeliveryOwner, DeliveriesRequestHandler.payment_success);
DeliveriesRouter.post('/:delivery_id/payment-cancel', YouAuthorizedSlim, DeliveryExists, IsDeliveryOwner, DeliveriesRequestHandler.payment_cancel);

DeliveriesRouter.post('/:delivery_id/ratings/customer', YouAuthorizedSlim, DeliveryExists, DeliveryIsCompleted, IsDeliveryCarrier, DeliveriesRequestHandler.leave_delivery_owner_review);
DeliveriesRouter.post('/:delivery_id/ratings/carrier', YouAuthorizedSlim, DeliveryExists, DeliveryIsCompleted, IsDeliveryOwner, DeliveriesRequestHandler.leave_delivery_carrier_review);

DeliveriesRouter.post('/:delivery_id/request-carrier-location', YouAuthorizedSlim, DeliveryExists, IsDeliveryOwner, DeliveryNotCompleted, IsNotDeliveryCarrierLocationRequestCompleted, DeliveriesRequestHandler.request_carrier_location);
DeliveriesRouter.post('/:delivery_id/cancel-request-carrier-location', YouAuthorizedSlim, DeliveryExists, IsDeliveryOwner, DeliveryNotCompleted, DeliveriesRequestHandler.cancel_request_carrier_location);
DeliveriesRouter.post('/:delivery_id/accept-request-carrier-location', YouAuthorizedSlim, DeliveryExists, IsDeliveryCarrier, DeliveryNotCompleted, IsNotDeliveryCarrierLocationRequestCompleted, DeliveriesRequestHandler.accept_request_carrier_location);
DeliveriesRouter.post('/:delivery_id/decline-request-carrier-location', YouAuthorizedSlim, DeliveryExists, IsDeliveryCarrier, DeliveryNotCompleted, IsNotDeliveryCarrierLocationRequestCompleted, DeliveriesRequestHandler.decline_request_carrier_location);
DeliveriesRouter.post('/:delivery_id/carrier-share-location', YouAuthorizedSlim, DeliveryExists, IsDeliveryCarrier, DeliveryNotCompleted, IsNotDeliveryCarrierLocationRequestCompleted, DeliveriesRequestHandler.carrier_share_location);
DeliveriesRouter.post('/:delivery_id/carrier-unshare-location', YouAuthorizedSlim, DeliveryExists, IsDeliveryCarrier, DeliveryNotCompleted,IsDeliveryCarrierLocationRequestCompleted, DeliveriesRequestHandler.carrier_unshare_location);
DeliveriesRouter.post('/:delivery_id/carrier-update-location', YouAuthorizedSlim, DeliveryExists, IsDeliveryCarrier, DeliveryNotCompleted, IsDeliveryCarrierLocationRequestCompleted, DeliveriesRequestHandler.carrier_update_location);

DeliveriesRouter.post('/:delivery_id/create-delivery-dispute', YouAuthorizedSlim, DeliveryExists, IsDeliveryOwnerOrCarrier, DeliveryNotCompleted, DeliveryDisputeNotExistsSlim, DeliveriesRequestHandler.create_delivery_dispute);
DeliveriesRouter.post('/:delivery_id/create-delivery-dispute-log', YouAuthorizedSlim, DeliveryExists, IsDeliveryOwnerOrCarrier, DeliveryNotCompleted, DeliveryDisputeExistsSlim, DeliveryDisputeStatusOpen, DeliveriesRequestHandler.create_delivery_dispute_log);
DeliveriesRouter.post('/:delivery_id/create-delivery-dispute-customer-support-message', YouAuthorizedSlim, DeliveryExists, IsDeliveryOwnerOrCarrier, DeliveryNotCompleted, DeliveryDisputeExistsSlim, DeliveryDisputeStatusOpen, DeliveriesRequestHandler.create_delivery_dispute_customer_service_message);
DeliveriesRouter.post('/:delivery_id/make-delivery-dispute-settlement-offer', YouAuthorizedSlim, DeliveryExists, IsDeliveryOwnerOrCarrier, DeliveryNotCompleted, DeliveryDisputeExistsSlim, DeliveryDisputeStatusOpen, DeliveryDisputeOpenSettlementNotExists, DeliveriesRequestHandler.make_delivery_dispute_settlement_offer);
DeliveriesRouter.post('/:delivery_id/cancel-delivery-dispute-settlement-offer', YouAuthorizedSlim, DeliveryExists, IsDeliveryOwnerOrCarrier, DeliveryNotCompleted, DeliveryDisputeExistsSlim, DeliveryDisputeStatusOpen, DeliveryDisputeOpenSettlementExists, IsSettlementOfferCreator, DeliveriesRequestHandler.cancel_delivery_dispute_settlement_offer);
DeliveriesRouter.post('/:delivery_id/accept-delivery-dispute-settlement-offer', YouAuthorizedSlim, DeliveryExists, IsDeliveryOwnerOrCarrier, DeliveryNotCompleted, DeliveryDisputeExistsSlim, DeliveryDisputeStatusOpen, DeliveryDisputeOpenSettlementExists, IsNotSettlementOfferCreator, DeliveriesRequestHandler.accept_delivery_dispute_settlement_offer);
DeliveriesRouter.post('/:delivery_id/decline-delivery-dispute-settlement-offer', YouAuthorizedSlim, DeliveryExists, IsDeliveryOwnerOrCarrier, DeliveryNotCompleted, DeliveryDisputeExistsSlim, DeliveryDisputeStatusOpen, DeliveryDisputeOpenSettlementExists, IsNotSettlementOfferCreator, DeliveriesRequestHandler.decline_delivery_dispute_settlement_offer);


/** PUT */

DeliveriesRouter.put('/:delivery_id', YouAuthorizedSlim, DeliveryExists, IsDeliveryOwner, DeliveryNotCompleted, DeliveryHasNoCarrierAssigned, DeliveriesRequestHandler.update_delivery);



/** DELETE */

DeliveriesRouter.delete('/:delivery_id', YouAuthorizedSlim, DeliveryExists, IsDeliveryOwner, DeliveriesRequestHandler.delete_delivery);