import { Router } from 'express';
import { UserExists, UserIdsAreDifferent, YouAuthorized, YouAuthorizedSlim } from '../guards/you.guard';
import { DeliveryExists, IsDeliveryCarrier } from '../guards/delivery.guard';
import { DeliveriesRequestHandler } from '../handlers/deliveries.handler';
import { UsersRequestHandler } from '../handlers/users.handler';
import { MessagingsRequestHandler } from '../handlers/messagings.handler';
import { NotificationsRequestHandler } from '../handlers/notifications.handler';
import { MessagesRequestHandler } from '../handlers/messages.handler';


export const UsersRouter: Router = Router({ mergeParams: true });

/** Profile Context */

UsersRouter.get('/phone/:phone', UsersRequestHandler.get_user_by_phone);

UsersRouter.get('/random', UsersRequestHandler.get_random_users);
UsersRouter.get('/check-session', UsersRequestHandler.check_session);
UsersRouter.get('/verify-email/:verification_code', UsersRequestHandler.verify_email);
UsersRouter.get('/send-sms-verification/:phone_number', YouAuthorizedSlim, UsersRequestHandler.send_sms_verification);
// UsersRouter.get('/verify-sms-code/request_id/:request_id/code/:code', YouAuthorizedSlim, UsersRequestHandler.verify_sms_code);
UsersRouter.get('/verify-sms-code/request_id/:request_id/code/:code/phone/:phone', YouAuthorizedSlim, UsersRequestHandler.verify_sms_code);


UsersRouter.get('/:you_id/account-info', YouAuthorized, UsersRequestHandler.get_account_info);
UsersRouter.get('/:you_id/stripe-login', YouAuthorized, UsersRequestHandler.stripe_login);

UsersRouter.get('/:you_id/api-key', YouAuthorized, UsersRequestHandler.get_user_api_key);
UsersRouter.get('/:you_id/customer-cards-payment-methods', YouAuthorized, UsersRequestHandler.get_user_customer_cards_payment_methods);
UsersRouter.get('/:you_id/get-subscription', YouAuthorized, UsersRequestHandler.get_subscription);
UsersRouter.get('/:you_id/is-subscription-active', YouAuthorized, UsersRequestHandler.is_subscription_active);

UsersRouter.get('/:you_id/notifications/all', YouAuthorized, NotificationsRequestHandler.get_user_notifications_all);
UsersRouter.get('/:you_id/notifications', YouAuthorized, NotificationsRequestHandler.get_user_notifications);
UsersRouter.get('/:you_id/notifications/:notification_id', YouAuthorized, NotificationsRequestHandler.get_user_notifications);

UsersRouter.get('/:you_id/notifications/app/:micro_app/app-notifications-last-opened', YouAuthorized, NotificationsRequestHandler.get_user_app_notification_last_opened);
UsersRouter.get('/:you_id/notifications/app/:micro_app/all', YouAuthorized, NotificationsRequestHandler.get_user_app_notifications_all);
UsersRouter.get('/:you_id/notifications/app/:micro_app', YouAuthorized, NotificationsRequestHandler.get_user_app_notifications);
UsersRouter.get('/:you_id/notifications/app/:micro_app/:notification_id', YouAuthorized, NotificationsRequestHandler.get_user_app_notifications);

UsersRouter.get('/:you_id/messagings/all', YouAuthorized, MessagingsRequestHandler.get_user_messagings_all);
UsersRouter.get('/:you_id/messagings', YouAuthorized, MessagingsRequestHandler.get_user_messagings);
UsersRouter.get('/:you_id/messagings/:messagings_timestamp', YouAuthorized, MessagingsRequestHandler.get_user_messagings);

UsersRouter.get('/:you_id/messages/:user_id', YouAuthorized, UserIdsAreDifferent, MessagesRequestHandler.get_user_messages);
UsersRouter.get('/:you_id/messages/:user_id/:min_id', YouAuthorized, UserIdsAreDifferent, MessagesRequestHandler.get_user_messages);

UsersRouter.get('/:user_id/get-subscription-info', UserExists, UsersRequestHandler.get_subscription_info);

UsersRouter.get('/:id', UsersRequestHandler.get_user_by_id);


// POST
UsersRouter.post('/', UsersRequestHandler.sign_up);
UsersRouter.post('/:email/password-reset', UsersRequestHandler.submit_reset_password_request);
UsersRouter.post('/:you_id/feedback', YouAuthorized, UsersRequestHandler.send_feedback);
UsersRouter.post('/:you_id/notifications/update-last-opened', YouAuthorized, NotificationsRequestHandler.update_user_last_opened);
UsersRouter.post('/:you_id/notifications/app/:micro_app/update-app-notifications-last-opened', YouAuthorized, NotificationsRequestHandler.update_user_app_notification_last_opened);
UsersRouter.post('/:you_id/send-message/:user_id', YouAuthorized, UserIdsAreDifferent, MessagesRequestHandler.send_user_message);
UsersRouter.post('/:you_id/customer-cards-payment-methods/:payment_method_id', YouAuthorized, UsersRequestHandler.add_card_payment_method_to_user_customer);
UsersRouter.post('/:you_id/create-subscription/:payment_method_id', YouAuthorized, UsersRequestHandler.create_subscription);
UsersRouter.post('/:you_id/cancel-subscription', YouAuthorized, UsersRequestHandler.cancel_subscription);

// PUT
UsersRouter.put('/', UsersRequestHandler.sign_in);
UsersRouter.put('/password-reset/:code', UsersRequestHandler.submit_password_reset_code);
UsersRouter.put('/:you_id/info', YouAuthorized, UsersRequestHandler.update_info);
UsersRouter.put('/:you_id/password', YouAuthorized, UsersRequestHandler.update_password);
UsersRouter.put('/:you_id/phone', YouAuthorized, UsersRequestHandler.update_phone);
UsersRouter.put('/:you_id/icon', YouAuthorized, UsersRequestHandler.update_icon);
UsersRouter.put('/:you_id/wallpaper', YouAuthorized, UsersRequestHandler.update_wallpaper);
UsersRouter.put('/:you_id/register-expo-device-and-push-token', YouAuthorized, UsersRequestHandler.register_expo_device_and_push_token);
UsersRouter.put('/:you_id/create-stripe-account', YouAuthorized, UsersRequestHandler.create_stripe_account);
UsersRouter.put('/:you_id/verify-stripe-account', YouAuthorized, UsersRequestHandler.verify_stripe_account);
UsersRouter.put('/:user_uuid/verify-stripe-account-by-uuid', UsersRequestHandler.verify_stripe_account_by_uuid);
UsersRouter.put('/:you_id/verify-customer-has-cards', YouAuthorized, UsersRequestHandler.verify_customer_has_card_payment_method);

// DELETE
UsersRouter.delete('/:you_id/customer-cards-payment-methods/:payment_method_id', YouAuthorized, UsersRequestHandler.remove_card_payment_method_to_user_customer);

UsersRouter.delete('/:you_id/remove-expo-device-and-push-token/:expo_token', YouAuthorized, UsersRequestHandler.remove_expo_device_and_push_token);





/** Deliveries Context */

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