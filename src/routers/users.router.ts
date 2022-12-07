import { Router } from 'express';
import { UserExists, YouAuthorized } from 'src/guards/you.guard';
import { DeliveryExists, IsDeliveryCarrier } from '../guards/delivery.guard';
import { DeliveriesRequestHandler } from '../handlers/deliveries.handler';


export const UsersRouter: Router = Router();

/** Public GET */

UsersRouter.get('/:user_id/stats', UserExists, DeliveriesRequestHandler.get_user_stats);

UsersRouter.get('/:user_id/get-deliveries/all', UserExists, DeliveriesRequestHandler.get_user_deliveries_all);
UsersRouter.get('/:user_id/get-deliveries', UserExists, DeliveriesRequestHandler.get_user_deliveries);
UsersRouter.get('/:user_id/get-deliveries/:delivery_id', UserExists, DeliveriesRequestHandler.get_user_deliveries);

UsersRouter.get('/:user_id/get-deliverings/all', UserExists, DeliveriesRequestHandler.get_user_deliverings_all);
UsersRouter.get('/:user_id/get-deliverings', UserExists, DeliveriesRequestHandler.get_user_deliverings);
UsersRouter.get('/:user_id/get-deliverings/:delivery_id', UserExists, DeliveriesRequestHandler.get_user_deliverings);

UsersRouter.get('/:user_id/get-deliveries-slim/all', UserExists, DeliveriesRequestHandler.get_user_deliveries_all_slim);
UsersRouter.get('/:user_id/get-deliveries-slim', UserExists, DeliveriesRequestHandler.get_user_deliveries_slim);
UsersRouter.get('/:user_id/get-deliveries-slim/:delivery_id', UserExists, DeliveriesRequestHandler.get_user_deliveries_slim);

UsersRouter.get('/:user_id/get-deliverings-slim/all', UserExists, DeliveriesRequestHandler.get_user_deliverings_all_slim);
UsersRouter.get('/:user_id/get-deliverings-slim', UserExists, DeliveriesRequestHandler.get_user_deliverings_slim);
UsersRouter.get('/:user_id/get-deliverings-slim/:delivery_id', UserExists, DeliveriesRequestHandler.get_user_deliverings_slim);

UsersRouter.get('/:you_id/delivering', YouAuthorized, DeliveriesRequestHandler.get_user_delivering);
UsersRouter.get('/:you_id/settings', YouAuthorized, DeliveriesRequestHandler.get_settings);

UsersRouter.post('/:you_id/settings', YouAuthorized, DeliveriesRequestHandler.update_settings);

UsersRouter.post('/:you_id/assign-delivery/:delivery_id', YouAuthorized, DeliveryExists, DeliveriesRequestHandler.assign_delivery);
UsersRouter.post('/:you_id/unassign-delivery/:delivery_id', YouAuthorized, DeliveryExists, DeliveriesRequestHandler.unassign_delivery);
UsersRouter.post('/:you_id/mark-delivery-as-picked-up/:delivery_id', YouAuthorized, DeliveryExists, DeliveriesRequestHandler.mark_delivery_as_picked_up);
UsersRouter.post('/:you_id/mark-delivery-as-dropped-off/:delivery_id', YouAuthorized, DeliveryExists, DeliveriesRequestHandler.mark_delivery_as_dropped_off);
UsersRouter.post('/:you_id/mark-delivery-as-returned/:delivery_id', YouAuthorized, DeliveryExists, DeliveriesRequestHandler.mark_delivery_as_returned);
UsersRouter.post('/:you_id/create-tracking-update/:delivery_id', YouAuthorized, DeliveryExists, DeliveriesRequestHandler.create_tracking_update);
UsersRouter.post('/:you_id/add-delivered-picture/:delivery_id', YouAuthorized, DeliveryExists, IsDeliveryCarrier, DeliveriesRequestHandler.add_delivered_picture); 

UsersRouter.post('/:you_id/add-from-person-id-picture/:delivery_id', YouAuthorized, DeliveryExists, IsDeliveryCarrier, DeliveriesRequestHandler.add_from_person_id_picture); 
UsersRouter.post('/:you_id/add-from-person-sig-picture/:delivery_id', YouAuthorized, DeliveryExists, IsDeliveryCarrier, DeliveriesRequestHandler.add_from_person_sig_picture); 
UsersRouter.post('/:you_id/add-to-person-id-picture/:delivery_id', YouAuthorized, DeliveryExists, IsDeliveryCarrier, DeliveriesRequestHandler.add_to_person_id_picture); 
UsersRouter.post('/:you_id/add-to-person-sig-picture/:delivery_id', YouAuthorized, DeliveryExists, IsDeliveryCarrier, DeliveriesRequestHandler.add_to_person_sig_picture); 