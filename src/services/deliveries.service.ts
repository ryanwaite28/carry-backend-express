import { fn } from 'sequelize';
import {
  CARRY_EVENT_TYPES,
  CARRY_NOTIFICATION_TARGET_TYPES,
  DeliveryDisputeSettlementOfferStatus,
  DeliveryDisputeStatus,
} from '../enums/carry.enum';
import {
  ICreateDeliveryProps,
  ICreateDeliveryTrackingUpdateProps,
  IDelivery,
  IDeliveryDispute,
  IDeliveryDisputeSettlementOffer,
} from '../interfaces/deliverme.interface';
import {
  StripeActions,
  DeliveryDisputes,
  CarryUserProfileSettings,
  UserPaymentIntents,
  CarryUserRatings,
} from '../models/delivery.model';
import {
  find_available_delivery_by_to_city_and_state,
  find_available_delivery_by_from_city_and_state,
  find_available_delivery,
  search_deliveries,
  browse_recent_deliveries,
  browse_featured_deliveries,
  browse_map_deliveries,
  get_delivery_by_id,
  create_delivery,
  delete_delivery,
  create_delivery_tracking_update,
  create_delivery_message,
  update_delivery,
  get_user_deliveries_count,
  get_user_delivering_completed_count,
  get_user_delivering_inprogress_count,
  set_delivery_carrier_location_requested,
  set_delivery_carrier_shared_location,
  set_delivery_carrier_lat_lng_location,
  get_delivery_carrier_location_request_pending,
  create_delivery_carrier_location_request,
  create_delivery_carrier_lat_lng_location_update,
  leave_delivery_review,
  get_user_delivering,
  get_user_deliverings_slim,
  get_user_deliverings_all_slim,
  get_user_deliveries_slim,
  get_user_deliverings,
  get_user_deliveries_all,
  get_user_deliveries,
  get_user_deliverings_all,
  reset_delivery,
  get_delivery_dispute_info_by_delivery_id,
  create_delivery_dispute,
  create_delivery_dispute_log,
  create_delivery_dispute_settlement_offer,
  update_delivery_dispute_settlement_offer_status,
  create_delivery_dispute_customer_service_message,
  get_user_dispute_messages_by_user_id_and_dispute_id,
  update_delivery_dispute,
} from '../repos/deliveries.repo';
import {
  create_notification,
  create_notification_and_send,
} from '../repos/notifications.repo';
import {
  create_delivery_dispute_customer_support_message_required_props,
  create_delivery_dispute_log_required_props,
  create_delivery_dispute_required_props,
  create_delivery_dispute_settlement_required_props,
  create_delivery_required_props,
  create_delivery_tracking_update_required_props,
  deliveryme_user_settings_required_props,
  delivery_carrier_review_required_props,
  populate_carry_notification_obj,
  update_delivery_required_props,
} from '../utils/carry.chamber';
import { CommonSocketEventsHandler } from './common.socket-event-handler';
import { ExpoPushNotificationsService } from './expo-notifications.service';
import { GoogleService } from './google.service';
import { StripeService } from './stripe.service';
import { UtilsService } from './utils.service';
import { UploadedFile } from 'express-fileupload';
import { IUser, INotification } from '../interfaces/carry.interface';
import {
  validateData,
  validateAndUploadImageFile,
} from '../utils/helpers.utils';
import { UsersService } from './users.service';
import Stripe from 'stripe';
import { get_user_ratings_stats_via_model } from '../repos/_common.repo';
import moment from 'moment';
import { PlainObject, ServiceMethodResults } from '../interfaces/common.interface';
import { HttpStatusCode } from '../enums/http-codes.enum';
import { validatePhone } from '../utils/validators.utils';
import { send_sms } from '../utils/sms-client.utils';
import { STATUSES, STRIPE_ACTION_EVENTS, TRANSACTION_STATUS } from '../enums/common.enum';






export class DeliveriesService {
  static async find_available_delivery_by_from_city_and_state(
    city: string,
    state: string,
  ) {
    const result = await find_available_delivery_by_from_city_and_state(
      city,
      state,
    );

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: result,
      },
    };
    return serviceMethodResults;
  }

  static async find_available_delivery_by_to_city_and_state(
    city: string,
    state: string,
  ) {
    const result = await find_available_delivery_by_to_city_and_state(
      city,
      state,
    );

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: result,
      },
    };
    return serviceMethodResults;
  }

  static async find_available_delivery(options: {
    you_id: number;
    criteria: string;
    city: string;
    state: string;
  }) {
    try {
      const { you_id, criteria, city, state } = options;
      const searchCriterias = [
        { label: 'From City', value: 'from-city' },
        { label: 'To City', value: 'to-city' },

        { label: 'From State', value: 'from-state' },
        { label: 'To State', value: 'to-state' },

        { label: 'From City in State', value: 'from-city-state' },
        { label: 'To City in State', value: 'to-city-state' },

        // { label: 'County in State', value: 'county-state' },
      ];
      const useWhere: any = {};

      switch (criteria) {
        case searchCriterias[0].value: {
          // from city
          useWhere.from_city = city;
          break;
        }
        case searchCriterias[1].value: {
          // to city
          useWhere.to_city = city;
          break;
        }

        case searchCriterias[2].value: {
          // from state
          useWhere.from_state = state;
          break;
        }
        case searchCriterias[3].value: {
          // to state
          useWhere.to_state = state;
          break;
        }

        case searchCriterias[4].value: {
          // from city-state
          useWhere.from_city = city;
          useWhere.from_state = state;
          break;
        }
        case searchCriterias[5].value: {
          // to city-state
          useWhere.to_city = city;
          useWhere.to_state = state;
          break;
        }

        default: {
          const serviceMethodResults: ServiceMethodResults = {
            status: HttpStatusCode.BAD_REQUEST,
            error: true,
            info: {
              message: `Unknown/Invalid criteria: ${criteria}`,
            },
          };
          return serviceMethodResults;
        }
      }

      const result = await find_available_delivery({
        you_id,
        where: useWhere,
      });

      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.OK,
        error: false,
        info: {
          data: result,
        },
      };
      return serviceMethodResults;
    } catch (e) {
      console.log(e);
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Could not find available delivery...`,
          data: e,
        },
      };
      return serviceMethodResults;
    }
  }

  static async search_deliveries(options: {
    you_id: number;
    from_city: string;
    from_state: string;
    to_city: string;
    to_state: string;
  }) {
    const results = await search_deliveries(options);
    let serviceMethodResults: ServiceMethodResults;

    if (results) {
      serviceMethodResults = {
        status: HttpStatusCode.OK,
        error: false,
        info: {
          data: results,
        },
      };
    } else {
      serviceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Could not parse search query.`,
        },
      };
    }

    return serviceMethodResults;
  }

  static async browse_recent_deliveries(params: {
    you_id: number;
    delivery_id?: number;
  }) {
    const deliveries = await browse_recent_deliveries(
      params.you_id,
      params.delivery_id,
    );

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: deliveries,
      },
    };
    return serviceMethodResults;
  }

  static async browse_featured_deliveries(params: {
    you_id: number;
    delivery_id?: number;
  }) {
    const deliveries = await browse_featured_deliveries(
      params.you_id,
      params.delivery_id,
    );

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: deliveries,
      },
    };
    return serviceMethodResults;
  }

  static async browse_map_deliveries(params: {
    you_id: number;
    swLat: number;
    swLng: number;
    neLat: number;
    neLng: number;
  }) {
    if (!params) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Query data/params not given.`,
          data: {},
        },
      };
      return serviceMethodResults;
    }

    if (!params.swLat) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `SouthWest Latitude not given.`,
          data: {},
        },
      };
      return serviceMethodResults;
    }
    if (!params.swLng) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `SouthWest Longitude not given.`,
          data: {},
        },
      };
      return serviceMethodResults;
    }
    if (!params.neLat) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `NorthEast Latitude not given.`,
          data: {},
        },
      };
      return serviceMethodResults;
    }
    if (!params.neLng) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `NorthEast Longitude not given.`,
          data: {},
        },
      };
      return serviceMethodResults;
    }

    const deliveries = await browse_map_deliveries(params);

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: deliveries,
      },
    };
    return serviceMethodResults;
  }

  static async send_delivery_message(options: {
    you_id: number;
    delivery: IDelivery;
    body: string;
    ignoreNotification?: boolean;
  }) {
    const { you_id, delivery, body, ignoreNotification } = options;

    const delivery_id = delivery.id;
    const owner_id = delivery.owner_id;
    const carrier_id = delivery.carrier_id!;

    if (you_id !== owner_id && you_id !== carrier_id) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `User is not involved with this delivery`,
        },
      };
      return serviceMethodResults;
    }

    if (!body || !body.trim()) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Body cannot be empty`,
        },
      };
      return serviceMethodResults;
    }

    // create the new message
    const new_message = await create_delivery_message({
      body,
      delivery_id,
      user_id: you_id,
    });

    const message_response = `New message for delivery "${delivery.title}": ${body}`;

    if (!ignoreNotification) {
      const to_id = you_id === owner_id ? carrier_id : owner_id;

      ExpoPushNotificationsService.sendUserPushNotification({
        user_id: to_id,
        message: message_response,
        data: { delivery_id },
      });

      create_notification({
        from_id: you_id,
        to_id: to_id,
        event: CARRY_EVENT_TYPES.DELIVERY_NEW_MESSAGE,
        target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY,
        target_id: delivery_id,
      }).then(async (notification_model) => {
        const notification = await populate_carry_notification_obj(
          notification_model,
        );

        const eventData = {
          delivery_id,
          event: CARRY_EVENT_TYPES.DELIVERY_NEW_MESSAGE,
          message: message_response,
          data: new_message,
          user_id: you_id,
          notification,
        };
        // const TO_ROOM = `${CARRY_EVENT_TYPES.TO_DELIVERY}:${delivery_id}`;
        // console.log({ TO_ROOM, eventData });
        // SocketsService.get_io().to(TO_ROOM).emit(TO_ROOM, eventData);

        CommonSocketEventsHandler.emitEventToUserSockets({
          user_id: to_id,
          event: CARRY_EVENT_TYPES.DELIVERY_NEW_MESSAGE,
          event_data: eventData,
        });

        const to_phone_number =
          to_id === delivery.owner_id
            ? delivery.owner?.phone
            : delivery.carrier?.phone;
        if (!!to_phone_number && validatePhone(to_phone_number)) {
          send_sms({
            to_phone_number,
            message: eventData.message,
          });
        }
      });
    }

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: message_response,
        data: new_message,
      },
    };
    return serviceMethodResults;
  }

  static async get_delivery_by_id(id: number) {
    const delivery = await get_delivery_by_id(id);

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: delivery,
      },
    };
    return serviceMethodResults;
  }

  static async get_user_deliveries_all(user_id: number) {
    const resultsList = await get_user_deliveries_all(user_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: resultsList,
      },
    };
    return serviceMethodResults;
  }

  static async get_user_deliveries(user_id: number, delivery_id?: number) {
    const resultsList = await get_user_deliveries(user_id, delivery_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: resultsList,
      },
    };
    return serviceMethodResults;
  }

  static async get_user_deliverings_all(user_id: number) {
    const resultsList = await get_user_deliverings_all(user_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: resultsList,
      },
    };
    return serviceMethodResults;
  }

  static async get_user_deliverings(user_id: number, delivery_id?: number) {
    const resultsList = await get_user_deliverings(user_id, delivery_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: resultsList,
      },
    };
    return serviceMethodResults;
  }

  static async get_user_deliveries_all_slim(user_id: number) {
    const resultsList = await get_user_deliveries_slim(user_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: resultsList,
      },
    };
    return serviceMethodResults;
  }

  static async get_user_deliveries_slim(user_id: number, delivery_id?: number) {
    const resultsList = await get_user_deliveries_slim(user_id, delivery_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: resultsList,
      },
    };
    return serviceMethodResults;
  }

  static async get_user_deliverings_all_slim(user_id: number) {
    const resultsList = await get_user_deliverings_all_slim(user_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: resultsList,
      },
    };
    return serviceMethodResults;
  }

  static async get_user_deliverings_slim(
    user_id: number,
    delivery_id?: number,
  ) {
    const resultsList = await get_user_deliverings_slim(user_id, delivery_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: resultsList,
      },
    };
    return serviceMethodResults;
  }

  static async get_user_delivering(you_id: number) {
    const resultsList = await get_user_delivering(you_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: resultsList,
      },
    };
    return serviceMethodResults;
  }

  static async create_delivery_and_charge(options: {
    you: IUser;
    data: any;
    delivery_image?: UploadedFile;
  }) {
    try {
      const { you, data, delivery_image } = options;
      const createObj: PlainObject = {
        owner_id: you.id,
      };

      // validate inputs
      const dataValidation = validateData({
        data,
        validators: create_delivery_required_props,
        mutateObj: createObj,
      });
      if (dataValidation.error) {
        return dataValidation;
      }

      const imageValidation = await validateAndUploadImageFile(delivery_image, {
        treatNotFoundAsError: false,
        mutateObj: createObj,
        id_prop: 'item_image_id',
        link_prop: 'item_image_link',
      });
      if (imageValidation.error) {
        return imageValidation;
      }

      // make sure payment method belongs to user
      const userPaymentMethodsResults =
        await StripeService.payment_method_belongs_to_customer(
          you.stripe_customer_account_id,
          data.payment_method_id,
        );
      if (userPaymentMethodsResults.error) {
        const serviceMethodResults: ServiceMethodResults = {
          status: userPaymentMethodsResults.status,
          error: userPaymentMethodsResults.error,
          info: {
            message: userPaymentMethodsResults.message,
          },
        };
        return serviceMethodResults;
      }

      // all inputs validated
      console.log(`createObj`, createObj);

      // try charging customer for delivery listing
      let payment_intent: Stripe.PaymentIntent;
      // let charge: Stripe.Charge;

      const is_subscription_active: boolean = (
        await UsersService.is_subscription_active(you)
      ).info.data as boolean;
      const chargeFeeData = StripeService.add_on_stripe_processing_fee(
        createObj.payout,
        is_subscription_active,
      );

      try {
        // https://stripe.com/docs/payments/save-during-payment

        payment_intent = await StripeService.stripe.paymentIntents.create({
          description: `${process.env.APP_NAME} - New delivery listing: ${createObj.title}`,
          amount: chargeFeeData.final_total,
          currency: 'usd',
          customer: you.stripe_customer_account_id,
          payment_method: data.payment_method_id,
          off_session: true,
          confirm: true,
        });

        // charge = await StripeService.stripe.charges.create({
        //   description: `${process.env.APP_NAME} - new delivery listing: ${createObj.title}`,
        //   amount: chargeFeeData.final_total,
        //   currency: 'usd',
        //   source: data.payment_method_id,
        // });
      } catch (e) {
        console.log(e);
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.BAD_REQUEST,
          error: true,
          info: {
            message: `Could not charge payment method`,
            error: e,
          },
        };
        return serviceMethodResults;
      }

      // charge was successful; create the delivery listing

      createObj.payment_intent_id = payment_intent.id;
      // createObj.charge_id = charge.id;

      const new_delivery_model = await create_delivery(
        createObj as ICreateDeliveryProps,
      );

      // record the charge

      const payment_intent_action = await StripeActions.create({
        action_event: STRIPE_ACTION_EVENTS.PAYMENT_INTENT,
        action_id: payment_intent.id,
        action_metadata: null,
        target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY,
        target_id: new_delivery_model.id,
        target_metadata: null,
        status: TRANSACTION_STATUS.COMPLETED,
      });

      // const charge_action = await StripeActions.create({
      //   action_event:                        STRIPE_ACTION_EVENTS.CHARGE,
      //   action_id:                           charge.id,
      //   action_metadata:                     null,
      //   micro_app:                           MODERN_APP_NAMES.CARRY,
      //   target_type:                         CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY,
      //   target_id:                           new_delivery_model.id,
      //   target_metadata:                     null,
      //   status:                              TRANSACTION_STATUS.COMPLETED,
      // });

      // update charge metadata with delivery id

      payment_intent = await StripeService.stripe.paymentIntents.update(
        payment_intent.id,
        {
          metadata: {
            delivery_id: new_delivery_model.id,
            was_subscribed: is_subscription_active ? 'true' : 'false',
          },
        },
      );

      // charge = await StripeService.stripe.charges.update(
      //   charge.id,
      //   { metadata: { delivery_id: new_delivery_model.id, was_subscribed: is_subscription_active ? 'true' : 'false' } }
      // );

      console.log(
        `Delivery created successfully. Delivery ID:`,
        new_delivery_model.id,
        {
          chargeFeeData,

          payment_intent,
          payment_intent_action: payment_intent_action.toJSON(),

          // charge,
          // charge_action: charge_action.toJSON(),
        },
      );

      // return delivery object
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.OK,
        error: false,
        info: {
          message: `New Delivery Created!`,
          data: new_delivery_model,
        },
      };
      return serviceMethodResults;
    } catch (e) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        error: true,
        info: {
          message: `Could not create new delivery`,
          error: e,
        },
      };
      return serviceMethodResults;
    }
  }

  /**
   * @deprecated
   * @param options
   * @returns
   */
  static async create_delivery(options: {
    you: IUser;
    data: any;
    delivery_image?: UploadedFile;
  }) {
    try {
      const { you, data, delivery_image } = options;
      const createObj: PlainObject = {
        owner_id: you.id,
      };

      // validate inputs
      const dataValidation = validateData({
        data,
        validators: create_delivery_required_props,
        mutateObj: createObj,
      });
      if (dataValidation.error) {
        return dataValidation;
      }

      const imageValidation = await validateAndUploadImageFile(delivery_image, {
        treatNotFoundAsError: false,
        mutateObj: createObj,
        id_prop: 'item_image_id',
        link_prop: 'item_image_link',
      });
      if (imageValidation.error) {
        return imageValidation;
      }

      // make sure payment method belongs to user
      const userPaymentMethodsResults =
        await StripeService.payment_method_belongs_to_customer(
          you.stripe_customer_account_id,
          data.payment_method_id,
        );
      if (userPaymentMethodsResults.error) {
        const serviceMethodResults: ServiceMethodResults = {
          status: userPaymentMethodsResults.status,
          error: userPaymentMethodsResults.error,
          info: {
            message: userPaymentMethodsResults.message,
          },
        };
        return serviceMethodResults;
      }

      // all inputs validated
      console.log(`createObj`, createObj);

      const new_delivery_model = await create_delivery(
        createObj as ICreateDeliveryProps,
      );

      // return delivery object
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.OK,
        error: false,
        info: {
          message: `New Delivery Created!`,
          data: new_delivery_model,
        },
      };
      return serviceMethodResults;
    } catch (e) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        error: true,
        info: {
          message: `Could not create new delivery`,
          error: e,
        },
      };
      return serviceMethodResults;
    }
  }

  static async update_delivery(options: {
    you: IUser;
    delivery: IDelivery;
    data: any;
    delivery_image?: UploadedFile;
  }) {
    const { delivery, data, you, delivery_image } = options;

    if (delivery.carrier_id) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Delivery cannot be updated while it is assigned to a carrier.`,
        },
      };
      return serviceMethodResults;
    }

    const updateObj: PlainObject = {};
    const dataValidation = validateData({
      data,
      validators: update_delivery_required_props,
      mutateObj: updateObj,
    });
    if (dataValidation.error) {
      return dataValidation;
    }

    const updates = await update_delivery(delivery.id, updateObj);

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Delivery Updated!`,
        data: updates,
      },
    };
    return serviceMethodResults;
  }

  static async delete_delivery_and_refund(delivery: IDelivery) {
    // const delivery_model = await get_delivery_by_id(delivery_id);

    if (!delivery) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.NOT_FOUND,
        error: true,
        info: {
          message: `Delivery not found.`,
        },
      };
      return serviceMethodResults;
    }

    if (!!delivery.carrier_id) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Delivery cannot be deleted while it is in progress.`,
        },
      };
      return serviceMethodResults;
    }

    // try to refund the charge

    if (delivery.payment_intent_id) {
      const payment_intent = await StripeService.stripe.paymentIntents.retrieve(
        delivery.payment_intent_id,
      );
      let refund: Stripe.Refund;

      const was_subscribed: boolean =
        payment_intent.metadata['was_subscribed'] === 'true' ? true : false;

      const chargeFeeData = StripeService.add_on_stripe_processing_fee(
        delivery.payout,
        was_subscribed,
      );

      try {
        refund = await StripeService.stripe.refunds.create({
          payment_intent: delivery.payment_intent_id,
          amount: chargeFeeData.refund_amount,
        });

        // record the refund
        const refund_action = await StripeActions.create({
          action_event: STRIPE_ACTION_EVENTS.REFUND,
          action_id: refund.id,
          action_metadata: null,
          target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY,
          target_id: delivery.id,
          target_metadata: null,
          status: TRANSACTION_STATUS.COMPLETED,
        });

        console.log(`refund issued and recorded successfully`, {
          refund_amount: chargeFeeData.refund_amount,
          refund_id: refund.id,
          refund_action_id: refund_action.get('id'),
        });
      } catch (e) {
        console.log(e);
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.INTERNAL_SERVER_ERROR,
          error: true,
          info: {
            message: `Could not issue refund`,
            error: e,
          },
        };
        return serviceMethodResults;
      }
    }

    if (delivery.charge_id) {
      const charge = await StripeService.stripe.charges.retrieve(
        delivery.charge_id,
      );
      let refund: Stripe.Refund;

      const was_subscribed: boolean =
        charge.metadata['was_subscribed'] === 'true' ? true : false;

      const chargeFeeData = StripeService.add_on_stripe_processing_fee(
        delivery.payout,
        was_subscribed,
      );

      try {
        refund = await StripeService.stripe.refunds.create({
          charge: delivery.charge_id,
          amount: chargeFeeData.refund_amount,
        });

        // record the refund
        const refund_action = await StripeActions.create({
          action_event: STRIPE_ACTION_EVENTS.REFUND,
          action_id: refund.id,
          action_metadata: null,
          target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY,
          target_id: delivery.id,
          target_metadata: null,
          status: TRANSACTION_STATUS.COMPLETED,
        });

        console.log(`refund issued and recorded successfully`, {
          refund_amount: chargeFeeData.refund_amount,
          refund_id: refund.id,
          refund_action_id: refund_action.get('id'),
        });
      } catch (e) {
        console.log(e);
        const serviceMethodResults: ServiceMethodResults = {
          status: HttpStatusCode.INTERNAL_SERVER_ERROR,
          error: true,
          info: {
            message: `Could not issue refund`,
            error: e,
          },
        };
        return serviceMethodResults;
      }
    }

    const deletes = await delete_delivery(delivery.id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Delivery Deleted!`,
        data: deletes,
      },
    };
    return serviceMethodResults;
  }

  /**
   * @deprecated
   * @param delivery
   * @returns
   */
  static async delete_delivery(delivery: IDelivery) {
    // const delivery_model = await get_delivery_by_id(delivery_id);

    if (!delivery) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.NOT_FOUND,
        error: true,
        info: {
          message: `Delivery not found`,
        },
      };
      return serviceMethodResults;
    }

    if (!!delivery.carrier_id) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Delivery is in progress`,
        },
      };
      return serviceMethodResults;
    }

    const deletes = await delete_delivery(delivery.id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Delivery Deleted!`,
        data: deletes,
      },
    };
    return serviceMethodResults;
  }

  static async assign_delivery(options: {
    you: IUser;
    delivery: IDelivery;
    ignoreNotification?: boolean;
  }) {
    const { you, delivery, ignoreNotification } = options;

    const delivery_id = delivery.id;
    const owner_id = delivery.owner_id;
    const carrier_id = delivery.carrier_id;

    if (!!carrier_id) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message:
            carrier_id === you.id
              ? `Delivery already assigned to you`
              : `Delivery already assigned to another carrier`,
        },
      };
      return serviceMethodResults;
    }

    if (!you.stripe_account_verified || !you.stripe_account_id) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Your stripe account is not setup`,
        },
      };
      return serviceMethodResults;
    }

    const delivering_inprogress_count =
      await get_user_delivering_inprogress_count(you.id);

    if (delivering_inprogress_count === 2) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.FORBIDDEN,
        error: true,
        info: {
          message: `Users can only claim at most 2 deliveries at a time.`,
        },
      };
      return serviceMethodResults;
    }

    const updatesobj: PlainObject = {};
    updatesobj.carrier_id = you.id;
    updatesobj.carrier_assigned_date = fn('NOW');
    updatesobj.returned = false;
    const updates = await update_delivery(delivery_id, updatesobj);

    console.log(`assigned delivery ==========`);

    if (!ignoreNotification) {
      create_notification({
        from_id: you.id,
        to_id: owner_id,
        event: CARRY_EVENT_TYPES.CARRIER_ASSIGNED,
        target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY,
        target_id: delivery_id,
      }).then(async (notification_model) => {
        console.log(`CARRIER_ASSIGNED notification created ==========`);

        const notification = await populate_carry_notification_obj(
          notification_model,
        );
        ExpoPushNotificationsService.sendUserPushNotification({
          user_id: notification.to_id,
          message: notification.message!,
          data: { delivery_id },
        });
        CommonSocketEventsHandler.emitEventToUserSockets({
          user_id: owner_id,
          event: CARRY_EVENT_TYPES.CARRIER_ASSIGNED,
          event_data: {
            delivery_id,
            data: updates,
            message: `Delivery assigned to user!`,
            user_id: you.id,
            notification,
          },
        });

        const to_phone_number =
          delivery.owner?.deliverme_settings?.phone || delivery.owner?.phone;
        if (!!to_phone_number && validatePhone(to_phone_number)) {
          send_sms({
            to_phone_number,
            message: notification.message,
          });
        }
      });
    }

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Delivery assigned to user!`,
        data: updates,
      },
    };
    return serviceMethodResults;
  }

  static async unassign_delivery(options: {
    you_id: number;
    delivery: IDelivery;
    ignoreNotification?: boolean;
  }) {
    const { you_id, delivery, ignoreNotification } = options;

    const delivery_id = delivery.id;
    const owner_id = delivery.owner_id;
    const carrier_id = delivery.carrier_id;

    if (carrier_id !== you_id) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `You are not the carrier of this delivery.`,
        },
      };
      return serviceMethodResults;
    }

    const updates = await reset_delivery(delivery);

    if (!ignoreNotification) {
      create_notification({
        from_id: you_id,
        to_id: owner_id,
        event: CARRY_EVENT_TYPES.CARRIER_UNASSIGNED,
        target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY,
        target_id: delivery_id,
      }).then(async (notification_model) => {
        const notification = await populate_carry_notification_obj(
          notification_model,
        );
        ExpoPushNotificationsService.sendUserPushNotification({
          user_id: notification.to_id,
          message: notification.message!,
          data: { delivery_id },
        });
        CommonSocketEventsHandler.emitEventToUserSockets({
          user_id: owner_id,
          event: CARRY_EVENT_TYPES.CARRIER_UNASSIGNED,
          event_data: {
            delivery_id,
            data: updates,
            message: `Delivery unassigned by carrier!`,
            user_id: you_id,
            notification,
          },
        });

        const to_phone_number =
          delivery.owner?.deliverme_settings?.phone || delivery.owner?.phone;
        if (!!to_phone_number && validatePhone(to_phone_number)) {
          send_sms({
            to_phone_number,
            message: notification.message,
          });
        }
      });
    }

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Delivery unassigned by carrier!`,
        data: updates,
      },
    };
    return serviceMethodResults;
  }

  static async create_tracking_update(options: {
    you_id: number;
    delivery: IDelivery;
    data: any;
    tracking_update_image?: UploadedFile;
    ignoreNotification?: boolean;
  }) {
    const {
      you_id,
      delivery,
      data,
      tracking_update_image,
      ignoreNotification,
    } = options;

    const delivery_id = delivery.id;
    const owner_id = delivery.owner_id;
    const carrier_id = delivery.carrier_id;

    if (carrier_id !== you_id) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `You are not the carrier of this delivery.`,
        },
      };
      return serviceMethodResults;
    }

    const createObj: any = {
      user_id: you_id,
      delivery_id,
    };

    const dataValidation = validateData({
      data,
      validators: create_delivery_tracking_update_required_props,
      mutateObj: createObj,
    });
    if (dataValidation.error) {
      return dataValidation;
    }

    const imageValidation = await validateAndUploadImageFile(
      tracking_update_image,
      {
        treatNotFoundAsError: false,
        mutateObj: createObj,
        id_prop: 'icon_id',
        link_prop: 'icon_link',
      },
    );
    if (imageValidation.error) {
      return imageValidation;
    }

    if (!createObj.location) {
      console.log(`finding location of tracking update...`);
      const position_stack_data =
        await UtilsService.get_location_via_coordinates(
          createObj.carrier_lat,
          createObj.carrier_lng,
        );
      if (position_stack_data.error) {
        console.log({
          position_stack_data: JSON.stringify(position_stack_data),
        });
        createObj.location = `Unknown location...`;
      } else {
        createObj.location = position_stack_data.info.data!.label;
      }
    }

    const new_delivery_tracking_update = await create_delivery_tracking_update(
      createObj as ICreateDeliveryTrackingUpdateProps,
    );

    if (!ignoreNotification) {
      create_notification({
        from_id: you_id,
        to_id: owner_id,
        event: CARRY_EVENT_TYPES.DELIVERY_NEW_TRACKING_UPDATE,
        target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY_TRACKING_UPDATE,
        target_id: new_delivery_tracking_update.id,
      }).then(async (notification_model) => {
        const notification = await populate_carry_notification_obj(
          notification_model,
        );
        ExpoPushNotificationsService.sendUserPushNotification({
          user_id: notification.to_id,
          message: notification.message!,
          data: { delivery_id },
        });
        CommonSocketEventsHandler.emitEventToUserSockets({
          user_id: owner_id,
          event: CARRY_EVENT_TYPES.DELIVERY_NEW_TRACKING_UPDATE,
          event_data: {
            delivery_id,
            data: new_delivery_tracking_update,
            message: `Delivery new tracking update!`,
            user_id: you_id,
            notification,
          },
        });

        const owner_phone =
          delivery.owner?.deliverme_settings?.phone || delivery.owner?.phone;
        if (!!owner_phone && validatePhone(owner_phone)) {
          GoogleService.getLocationFromCoordinates(
            createObj.carrier_lat,
            createObj.carrier_lng,
          )
            .then((placeData) => {
              const msg =
                `${process.env.APP_NAME} - Delivery: new tracking update for delivery "${delivery.title}"\n\n` +
                `${createObj.message}\n\n` +
                `Carrier's Location: ${placeData.city}, ${placeData.state} ` +
                `${placeData.county ? '(' + placeData.county + ')' : ''} ${
                  placeData.zipcode
                }`;
              console.log(`sending:`, msg);

              send_sms({
                to_phone_number: owner_phone,
                message: msg,
              });
            })
            .catch((error) => {
              console.log(`Can't send sms with location; sending without...`);
              const msg =
                `${process.env.APP_NAME} - Delivery: new tracking update for delivery "${delivery.title}"\n\n` +
                `${createObj.message}`;
              console.log(`sending:`, msg);

              send_sms({
                to_phone_number: owner_phone,
                message: msg,
              });
            });
        }
      });
    }

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Delivery new tracking update!`,
        data: new_delivery_tracking_update,
      },
    };
    return serviceMethodResults;
  }

  static async add_delivered_picture(options: {
    you_id: number;
    delivery: IDelivery;
    delivered_image?: UploadedFile;
    ignoreNotification?: boolean;
  }) {
    const { you_id, delivery, delivered_image, ignoreNotification } = options;
    console.log(`===== add_delivered_picture`, options);

    const delivery_id = delivery.id;
    const owner_id = delivery.owner_id;
    const carrier_id = delivery.carrier_id;

    if (carrier_id !== you_id) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `You are not the carrier of this delivery.`,
        },
      };
      return serviceMethodResults;
    }
    if (
      !delivery.completed &&
      !!delivery.datetime_picked_up &&
      !!delivery.delivered_image_id
    ) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Delivery delivered image already added`,
        },
      };
      return serviceMethodResults;
    }

    const imageValidation = await validateAndUploadImageFile(delivered_image, {
      treatNotFoundAsError: true,
    });
    if (imageValidation.error) {
      return imageValidation;
    }

    const updatesobj: PlainObject = {};
    updatesobj.delivered_image_id = imageValidation.info.data.image_id;
    updatesobj.delivered_image_link = imageValidation.info.data.image_link;
    const updates = await update_delivery(delivery_id, updatesobj);

    if (!ignoreNotification) {
      create_notification({
        from_id: you_id,
        to_id: owner_id,
        event: CARRY_EVENT_TYPES.DELIVERY_ADD_COMPLETED_PICTURE,
        target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY,
        target_id: delivery_id,
      }).then(async (notification_model) => {
        const notification = await populate_carry_notification_obj(
          notification_model,
        );
        ExpoPushNotificationsService.sendUserPushNotification({
          user_id: notification.to_id,
          message: notification.message!,
          data: { delivery_id },
        });
        CommonSocketEventsHandler.emitEventToUserSockets({
          user_id: owner_id,
          event: CARRY_EVENT_TYPES.DELIVERY_ADD_COMPLETED_PICTURE,
          event_data: {
            delivery_id,
            data: updates,
            message: `Delivery added delivered picture!`,
            user_id: you_id,
            notification,
            ...imageValidation.info.data,
          },
        });

        const to_phone_number =
          delivery.owner?.deliverme_settings?.phone || delivery.owner?.phone;
        if (!!to_phone_number && validatePhone(to_phone_number)) {
          send_sms({
            to_phone_number,
            message: notification.message,
          });
        }
      });
    }

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Delivery added delivered picture!`,
        data: {
          ...updates,
          ...imageValidation.info.data,
        },
      },
    };
    return serviceMethodResults;
  }

  static async add_from_person_id_picture(options: {
    you_id: number;
    delivery: IDelivery;
    image?: UploadedFile;
    ignoreNotification?: boolean;
  }) {
    const { you_id, delivery, image, ignoreNotification } = options;
    console.log(`===== add_from_person_id_picture`, options);

    const delivery_id = delivery.id;
    const owner_id = delivery.owner_id;
    const carrier_id = delivery.carrier_id;

    if (carrier_id !== you_id) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `You are not the carrier of this delivery.`,
        },
      };
      return serviceMethodResults;
    }
    if (!!delivery.datetime_picked_up) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Delivery already picked up.`,
        },
      };
      return serviceMethodResults;
    }
    if (!!delivery.from_person_id_image_id) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Pickup person id already uploaded.`,
        },
      };
      return serviceMethodResults;
    }

    const imageValidation = await validateAndUploadImageFile(image, {
      treatNotFoundAsError: true,
    });
    if (imageValidation.error) {
      return imageValidation;
    }

    const updatesobj: PlainObject = {};
    updatesobj.from_person_id_image_id = imageValidation.info.data.image_id;
    updatesobj.from_person_id_image_link = imageValidation.info.data.image_link;
    const updates = await update_delivery(delivery_id, updatesobj);

    const message = `Delivery added from person id picture!`;

    if (!ignoreNotification) {
      create_notification({
        from_id: you_id,
        to_id: owner_id,
        event: CARRY_EVENT_TYPES.DELIVERY_FROM_PERSON_ID_PICTURE_ADDED,
        target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY,
        target_id: delivery_id,
      }).then(async (notification_model) => {
        const notification = await populate_carry_notification_obj(
          notification_model,
        );
        ExpoPushNotificationsService.sendUserPushNotification({
          user_id: notification.to_id,
          message: notification.message!,
          data: { delivery_id },
        });
        CommonSocketEventsHandler.emitEventToUserSockets({
          user_id: owner_id,
          event: CARRY_EVENT_TYPES.DELIVERY_FROM_PERSON_ID_PICTURE_ADDED,
          event_data: {
            delivery_id,
            data: updates,
            message,
            user_id: you_id,
            notification,
            ...imageValidation.info.data,
          },
        });

        const to_phone_number =
          delivery.owner?.deliverme_settings?.phone || delivery.owner?.phone;
        if (!!to_phone_number && validatePhone(to_phone_number)) {
          send_sms({
            to_phone_number,
            message: notification.message,
          });
        }
      });
    }

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message,
        data: {
          ...updates,
          ...imageValidation.info.data,
        },
      },
    };
    return serviceMethodResults;
  }

  static async add_from_person_sig_picture(options: {
    you_id: number;
    delivery: IDelivery;
    image?: UploadedFile;
    ignoreNotification?: boolean;
  }) {
    const { you_id, delivery, image, ignoreNotification } = options;
    console.log(`===== add_from_person_sig_picture`, options);

    const delivery_id = delivery.id;
    const owner_id = delivery.owner_id;
    const carrier_id = delivery.carrier_id;

    if (carrier_id !== you_id) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `You are not the carrier of this delivery.`,
        },
      };
      return serviceMethodResults;
    }

    if (!!delivery.datetime_picked_up) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Delivery already picked up.`,
        },
      };
      return serviceMethodResults;
    }
    if (!!delivery.from_person_sig_image_id) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Pickup person sig already uploaded.`,
        },
      };
      return serviceMethodResults;
    }

    const imageValidation = await validateAndUploadImageFile(image, {
      treatNotFoundAsError: true,
    });
    if (imageValidation.error) {
      return imageValidation;
    }

    const updatesobj: PlainObject = {};
    updatesobj.from_person_sig_image_id = imageValidation.info.data.image_id;
    updatesobj.from_person_sig_image_link =
      imageValidation.info.data.image_link;
    const updates = await update_delivery(delivery_id, updatesobj);

    const message = `Delivery added from person sig picture!`;

    if (!ignoreNotification) {
      create_notification({
        from_id: you_id,
        to_id: owner_id,
        event: CARRY_EVENT_TYPES.DELIVERY_FROM_PERSON_ID_PICTURE_ADDED,
        target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY,
        target_id: delivery_id,
      }).then(async (notification_model) => {
        const notification = await populate_carry_notification_obj(
          notification_model,
        );
        ExpoPushNotificationsService.sendUserPushNotification({
          user_id: notification.to_id,
          message: notification.message!,
          data: { delivery_id },
        });
        CommonSocketEventsHandler.emitEventToUserSockets({
          user_id: owner_id,
          event: CARRY_EVENT_TYPES.DELIVERY_FROM_PERSON_ID_PICTURE_ADDED,
          event_data: {
            delivery_id,
            data: updates,
            message,
            user_id: you_id,
            notification,
            ...imageValidation.info.data,
          },
        });

        const to_phone_number =
          delivery.owner?.deliverme_settings?.phone || delivery.owner?.phone;
        if (!!to_phone_number && validatePhone(to_phone_number)) {
          send_sms({
            to_phone_number,
            message: notification.message,
          });
        }
      });
    }

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message,
        data: {
          ...updates,
          ...imageValidation.info.data,
        },
      },
    };
    return serviceMethodResults;
  }

  static async add_to_person_id_picture(options: {
    you_id: number;
    delivery: IDelivery;
    image?: UploadedFile;
    ignoreNotification?: boolean;
  }) {
    const { you_id, delivery, image, ignoreNotification } = options;
    console.log(`===== add_to_person_id_picture`, options);

    const delivery_id = delivery.id;
    const owner_id = delivery.owner_id;
    const carrier_id = delivery.carrier_id;

    if (carrier_id !== you_id) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `You are not the carrier of this delivery.`,
        },
      };
      return serviceMethodResults;
    }
    if (
      !delivery.completed &&
      !!delivery.datetime_picked_up &&
      !!delivery.to_person_id_image_id
    ) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Dropoff person id already added.`,
        },
      };
      return serviceMethodResults;
    }

    const imageValidation = await validateAndUploadImageFile(image, {
      treatNotFoundAsError: true,
    });
    if (imageValidation.error) {
      return imageValidation;
    }

    const updatesobj: PlainObject = {};
    updatesobj.to_person_id_image_id = imageValidation.info.data.image_id;
    updatesobj.to_person_id_image_link = imageValidation.info.data.image_link;
    const updates = await update_delivery(delivery_id, updatesobj);

    const message = `Delivery added to person id picture!`;

    if (!ignoreNotification) {
      create_notification({
        from_id: you_id,
        to_id: owner_id,
        event: CARRY_EVENT_TYPES.DELIVERY_TO_PERSON_ID_PICTURE_ADDED,
        target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY,
        target_id: delivery_id,
      }).then(async (notification_model) => {
        const notification = await populate_carry_notification_obj(
          notification_model,
        );
        ExpoPushNotificationsService.sendUserPushNotification({
          user_id: notification.to_id,
          message: notification.message!,
          data: { delivery_id },
        });
        CommonSocketEventsHandler.emitEventToUserSockets({
          user_id: owner_id,
          event: CARRY_EVENT_TYPES.DELIVERY_TO_PERSON_ID_PICTURE_ADDED,
          event_data: {
            delivery_id,
            data: updates,
            message,
            user_id: you_id,
            notification,
            ...imageValidation.info.data,
          },
        });

        const to_phone_number =
          delivery.owner?.deliverme_settings?.phone || delivery.owner?.phone;
        if (!!to_phone_number && validatePhone(to_phone_number)) {
          send_sms({
            to_phone_number,
            message: notification.message,
          });
        }
      });
    }

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message,
        data: {
          ...updates,
          ...imageValidation.info.data,
        },
      },
    };
    return serviceMethodResults;
  }

  static async add_to_person_sig_picture(options: {
    you_id: number;
    delivery: IDelivery;
    image?: UploadedFile;
    ignoreNotification?: boolean;
  }) {
    const { you_id, delivery, image, ignoreNotification } = options;
    console.log(`===== add_to_person_sig_picture`, options);

    const delivery_id = delivery.id;
    const owner_id = delivery.owner_id;
    const carrier_id = delivery.carrier_id;

    if (carrier_id !== you_id) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `You are not the carrier of this delivery.`,
        },
      };
      return serviceMethodResults;
    }
    if (
      !delivery.completed &&
      !!delivery.datetime_picked_up &&
      !!delivery.to_person_sig_image_id
    ) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Dropoff person signature already added.`,
        },
      };
      return serviceMethodResults;
    }

    const imageValidation = await validateAndUploadImageFile(image, {
      treatNotFoundAsError: true,
    });
    if (imageValidation.error) {
      return imageValidation;
    }

    const updatesobj: PlainObject = {};
    updatesobj.to_person_sig_image_id = imageValidation.info.data.image_id;
    updatesobj.to_person_sig_image_link = imageValidation.info.data.image_link;
    const updates = await update_delivery(delivery_id, updatesobj);

    const message = `Delivery added to person sig picture!`;

    if (!ignoreNotification) {
      create_notification({
        from_id: you_id,
        to_id: owner_id,
        event: CARRY_EVENT_TYPES.DELIVERY_TO_PERSON_ID_PICTURE_ADDED,
        target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY,
        target_id: delivery_id,
      }).then(async (notification_model) => {
        const notification = await populate_carry_notification_obj(
          notification_model,
        );
        ExpoPushNotificationsService.sendUserPushNotification({
          user_id: notification.to_id,
          message: notification.message!,
          data: { delivery_id },
        });
        CommonSocketEventsHandler.emitEventToUserSockets({
          user_id: owner_id,
          event: CARRY_EVENT_TYPES.DELIVERY_TO_PERSON_ID_PICTURE_ADDED,
          event_data: {
            delivery_id,
            data: updates,
            message,
            user_id: you_id,
            notification,
            ...imageValidation.info.data,
          },
        });

        const to_phone_number =
          delivery.owner?.deliverme_settings?.phone || delivery.owner?.phone;
        if (!!to_phone_number && validatePhone(to_phone_number)) {
          send_sms({
            to_phone_number,
            message: notification.message,
          });
        }
      });
    }

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message,
        data: {
          ...updates,
          ...imageValidation.info.data,
        },
      },
    };
    return serviceMethodResults;
  }

  static async mark_delivery_as_picked_up(options: {
    you_id: number;
    delivery: IDelivery;
    ignoreNotification?: boolean;
  }) {
    const { you_id, delivery, ignoreNotification } = options;

    const delivery_id = delivery.id;
    const owner_id = delivery.owner_id;
    const carrier_id = delivery.carrier_id;

    if (carrier_id !== you_id) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `You are not the carrier of this delivery.`,
        },
      };
      return serviceMethodResults;
    }

    const updatesobj: PlainObject = {};
    updatesobj.datetime_picked_up = fn('NOW');
    const updates = await update_delivery(delivery_id, updatesobj);

    if (!ignoreNotification) {
      create_notification({
        from_id: you_id,
        to_id: owner_id,
        event: CARRY_EVENT_TYPES.CARRIER_MARKED_AS_PICKED_UP,
        target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY,
        target_id: delivery_id,
      }).then(async (notification_model) => {
        const notification = await populate_carry_notification_obj(
          notification_model,
        );
        ExpoPushNotificationsService.sendUserPushNotification({
          user_id: notification.to_id,
          message: notification.message!,
          data: { delivery_id },
        });
        CommonSocketEventsHandler.emitEventToUserSockets({
          user_id: owner_id,
          event: CARRY_EVENT_TYPES.CARRIER_MARKED_AS_PICKED_UP,
          event_data: {
            delivery_id,
            data: updates,
            message: `Delivery picked up by carrier!`,
            user_id: you_id,
            notification,
          },
        });

        const to_phone_number =
          delivery.owner?.deliverme_settings?.phone || delivery.owner?.phone;
        if (!!to_phone_number && validatePhone(to_phone_number)) {
          send_sms({
            to_phone_number,
            message: notification.message,
          });
        }
      });
    }

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Delivery picked up by carrier!`,
        data: updates,
      },
    };
    return serviceMethodResults;
  }

  static async mark_delivery_as_dropped_off(options: {
    you_id: number;
    delivery: IDelivery;
    ignoreNotification?: boolean;
  }) {
    const { you_id, delivery, ignoreNotification } = options;

    const delivery_id = delivery.id;
    const owner_id = delivery.owner_id;
    const carrier_id = delivery.carrier_id;

    if (carrier_id !== you_id) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `You are not the carrier of this delivery.`,
        },
      };
      return serviceMethodResults;
    }

    const updatesobj: PlainObject = {};
    updatesobj.datetime_delivered = fn('NOW');
    const updates = await update_delivery(delivery_id, updatesobj);

    if (!ignoreNotification) {
      create_notification({
        from_id: you_id,
        to_id: owner_id,
        event: CARRY_EVENT_TYPES.CARRIER_MARKED_AS_DROPPED_OFF,
        target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY,
        target_id: delivery_id,
      }).then(async (notification_model) => {
        const notification = await populate_carry_notification_obj(
          notification_model,
        );
        ExpoPushNotificationsService.sendUserPushNotification({
          user_id: notification.to_id,
          message: notification.message!,
          data: { delivery_id },
        });
        CommonSocketEventsHandler.emitEventToUserSockets({
          user_id: owner_id,
          event: CARRY_EVENT_TYPES.CARRIER_MARKED_AS_DROPPED_OFF,
          event_data: {
            delivery_id,
            data: updates,
            message: `Delivery dropped off by carrier!`,
            user_id: you_id,
            notification,
          },
        });

        const to_phone_number =
          delivery.owner?.deliverme_settings?.phone || delivery.owner?.phone;
        if (!!to_phone_number && validatePhone(to_phone_number)) {
          send_sms({
            to_phone_number,
            message: notification.message,
          });
        }
      });
    }

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Delivery dropped off by carrier!`,
        data: updates,
      },
    };
    return serviceMethodResults;
  }

  static async mark_delivery_as_completed(options: {
    you_id: number;
    delivery: IDelivery;
    ignoreNotification?: boolean;
  }) {
    const { you_id, delivery, ignoreNotification } = options;

    if (delivery.owner_id !== you_id) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `You are not the owner of this delivery.`,
        },
      };
      return serviceMethodResults;
    }

    if (delivery.completed) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Delivery is already completed.`,
        },
      };
      return serviceMethodResults;
    }

    const updatesobj: PlainObject = {};
    updatesobj.completed = true;
    updatesobj.datetime_completed = fn('NOW');
    const updates = await update_delivery(delivery.id, updatesobj);

    if (!ignoreNotification) {
      create_notification({
        from_id: you_id,
        to_id: delivery.carrier_id!,
        event: CARRY_EVENT_TYPES.DELIVERY_COMPLETED,
        target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY,
        target_id: delivery.id,
      }).then(async (notification_model) => {
        const notification = await populate_carry_notification_obj(
          notification_model,
        );
        ExpoPushNotificationsService.sendUserPushNotification({
          user_id: notification.to_id,
          message: notification.message!,
          data: { delivery_id: delivery.id },
        });
        CommonSocketEventsHandler.emitEventToUserSockets({
          user_id: delivery.carrier_id!,
          event: CARRY_EVENT_TYPES.DELIVERY_COMPLETED,
          event_data: {
            delivery_id: delivery.id,
            data: updates,
            message: `Delivery completed!`,
            user_id: you_id,
            notification,
          },
        });

        const to_phone_number =
          delivery.carrier?.deliverme_settings?.phone || delivery.carrier?.phone;
        if (!!to_phone_number && validatePhone(to_phone_number)) {
          send_sms({
            to_phone_number,
            message: notification.message,
          });
        }
      });
    }

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Delivery completed!`,
        data: updates,
      },
    };
    return serviceMethodResults;
  }

  static async mark_delivery_as_returned(options: {
    you_id: number;
    delivery: IDelivery;
    ignoreNotification?: boolean;
  }) {
    const { you_id, delivery, ignoreNotification } = options;

    const delivery_id = delivery.id;
    const owner_id = delivery.owner_id;
    const carrier_id = delivery.carrier_id;

    if (carrier_id !== you_id) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `You are not the carrier of this delivery.`,
        },
      };
      return serviceMethodResults;
    }

    if (delivery.returned) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Delivery is already returned.`,
        },
      };
      return serviceMethodResults;
    }

    const updates = await reset_delivery(delivery);

    if (!ignoreNotification) {
      create_notification({
        from_id: carrier_id,
        to_id: owner_id,
        event: CARRY_EVENT_TYPES.DELIVERY_RETURNED,
        target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY,
        target_id: delivery_id,
      }).then(async (notification_model) => {
        const notification = await populate_carry_notification_obj(
          notification_model,
        );
        ExpoPushNotificationsService.sendUserPushNotification({
          user_id: notification.to_id,
          message: notification.message!,
          data: { delivery_id },
        });
        CommonSocketEventsHandler.emitEventToUserSockets({
          user_id: owner_id,
          event: CARRY_EVENT_TYPES.DELIVERY_RETURNED,
          event_data: {
            delivery_id,
            event: CARRY_EVENT_TYPES.DELIVERY_RETURNED,
            data: updates,
            message: `Delivery returned`,
            user_id: you_id,
            notification,
          },
        });

        const to_phone_number =
          delivery.owner?.deliverme_settings?.phone || delivery.owner?.phone;
        if (!!to_phone_number && validatePhone(to_phone_number)) {
          send_sms({
            to_phone_number,
            message: notification.message,
          });
        }
      });
    }

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Delivery returned`,
        data: updates,
      },
    };
    return serviceMethodResults;
  }

  static async get_settings(you_id: number) {
    let settings = await CarryUserProfileSettings.findOne({
      where: { user_id: you_id },
    });
    if (!settings) {
      settings = await CarryUserProfileSettings.create({
        user_id: you_id,
      });
    }

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: settings,
      },
    };
    return serviceMethodResults;
  }

  static async update_settings(you_id: number, data: any) {
    const updatesObj: any = {};

    let settings = await CarryUserProfileSettings.findOne({
      where: { user_id: you_id },
    });
    if (!settings) {
      settings = await CarryUserProfileSettings.create({
        user_id: you_id,
      });
    }

    const dataValidation = validateData({
      data,
      validators: deliveryme_user_settings_required_props,
      mutateObj: updatesObj,
    });
    if (dataValidation.error) {
      return dataValidation;
    }

    const updates = await settings.update(updatesObj);

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Updated settings successfully!`,
        data: updates,
      },
    };
    return serviceMethodResults;
  }

  static async create_payment_intent(options: {
    you_id: number;
    delivery: IDelivery;
    host: string;
  }) {
    const { you_id, delivery, host } = options;

    const delivery_id = delivery.id;
    const owner_id = delivery.owner_id;
    const carrier_id = delivery.carrier_id;

    if (owner_id !== you_id) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `You are not the owner of this delivery.`,
        },
      };
      return serviceMethodResults;
    }

    if (delivery.completed) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Delivery is already completed`,
        },
      };
      return serviceMethodResults;
    }

    if (
      !delivery.owner?.stripe_account_verified ||
      !delivery.owner?.stripe_account_id
    ) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Owner's stripe account is not setup`,
        },
      };
      return serviceMethodResults;
    }

    if (
      !delivery.carrier?.stripe_account_verified ||
      !delivery.carrier?.stripe_account_id
    ) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Carrier's stripe account is not setup`,
        },
      };
      return serviceMethodResults;
    }

    const useHost = host.endsWith('/') ? host.substr(0, host.length - 1) : host;
    const successUrl =
      process.env.CARRY_PAYMENT_SUCCESS_URL ||
      `${useHost}/deliveries/${delivery_id}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl =
      process.env.CARRY_PAYMENT_CANCEL_URL ||
      `${useHost}/deliveries/${delivery_id}/payment-cancel?session_id={CHECKOUT_SESSION_ID}`;

    // const createPaymentOpts = {
    //   payment_method_types: ['card'],
    //   line_items: [
    //     {
    //       price_data: {
    //         currency: 'usd',
    //         product_data: {
    //           name: `Delivery of ${delivery.title} by ${getUserFullName(delivery.carrier)}`,
    //         },
    //         unit_amount: parseFloat(delivery.payout + '00'),
    //       },
    //       quantity: 1,
    //     },
    //   ],
    //   mode: 'payment',
    //   success_url: successUrl,
    //   cancel_url: cancelUrl,
    // };

    // const session = await stripe.checkout.sessions.create(createPaymentOpts);

    // console.log({ createPaymentOpts }, JSON.stringify(createPaymentOpts));
    // console.log({ session });

    let paymentIntent: Stripe.PaymentIntent;

    try {
      const is_subscription_active: boolean = (
        await UsersService.is_subscription_active(delivery.owner!)
      ).info.data as boolean;
      const chargeFeeData = StripeService.add_on_stripe_processing_fee(
        delivery.payout,
        is_subscription_active,
      );
      paymentIntent = await StripeService.stripe.paymentIntents.create(
        {
          payment_method_types: ['card'],
          amount: chargeFeeData.final_total,
          currency: 'usd',
          application_fee_amount: chargeFeeData.app_fee, // free, for now
          transfer_data: {
            destination: delivery.carrier.stripe_account_id,
          },
          metadata: {
            user_id: you_id,
            payment_intent_event: CARRY_EVENT_TYPES.DELIVERY_COMPLETED,
            target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY,
            target_id: delivery.id,
          },
        },
        // { stripeAccount: you.stripe_account_id }
      );

      const updatesobj: PlainObject = {};
      updatesobj.payment_session_id = paymentIntent.id;
      const updates = await update_delivery(delivery_id, updatesobj);
    } catch (error) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        error: true,
        info: {
          message: (<any>error).message,
          error,
        },
      };
      return serviceMethodResults;
    }

    // check if delivery already has a session. if so, over-write with new one
    // await delivery_model.update({ paymentIntent });

    const newIntent = await UserPaymentIntents.create({
      user_id: owner_id,
      payment_intent_id: paymentIntent.id,
      payment_intent_event: CARRY_EVENT_TYPES.DELIVERY_COMPLETED,
      target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY,
      target_id: delivery_id,
    });

    // console.log({ newIntent, paymentIntent });

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Payment intent created`,
        data: {
          payment_client_secret: paymentIntent.client_secret,
          stripe_pk: process.env.STRIPE_PK,
        },
      },
    };
    return serviceMethodResults;
  }

  static async payment_success(options: {
    you_id: number;
    delivery: IDelivery;
    session_id: string;
    ignoreNotification?: boolean;
  }) {
    const { you_id, delivery, session_id, ignoreNotification } = options;

    const delivery_id = delivery.id;
    const owner_id = delivery.owner_id;
    const carrier_id = delivery.carrier_id!;

    if (!session_id) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Payment session_id was not added as query param on request`,
        },
      };
      return serviceMethodResults;
    }

    if (session_id !== delivery.payment_session_id) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Payment session_id does not match with delivery`,
        },
      };
      return serviceMethodResults;
    }

    if (delivery.completed) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Delivery already completed`,
        },
      };
      return serviceMethodResults;
    }

    // pay carrier

    const updatesobj: PlainObject = {};
    updatesobj.completed = true;
    const updates = await update_delivery(delivery_id, updatesobj);

    if (!ignoreNotification) {
      create_notification({
        from_id: you_id,
        to_id: carrier_id,
        event: CARRY_EVENT_TYPES.DELIVERY_COMPLETED,
        target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY,
        target_id: delivery_id,
      }).then(async (notification_model) => {
        const notification = await populate_carry_notification_obj(
          notification_model,
        );
        ExpoPushNotificationsService.sendUserPushNotification({
          user_id: notification.to_id,
          message: notification.message!,
          data: { delivery_id },
        });
        CommonSocketEventsHandler.emitEventToUserSockets({
          user_id: carrier_id,
          event: CARRY_EVENT_TYPES.DELIVERY_COMPLETED,
          event_data: {
            data: updates,
            message: `Delivery completed!`,
            user: you_id,
            notification,
          },
        });

        const to_phone_number =
          delivery.carrier?.deliverme_settings?.phone || delivery.carrier?.phone;
        if (!!to_phone_number && validatePhone(to_phone_number)) {
          send_sms({
            to_phone_number,
            message: notification.message,
          });
        }
      });
    }

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Payment session completed`,
        data: updates,
      },
    };
    return serviceMethodResults;
  }

  static async payment_cancel(options: {
    you_id: number;
    delivery: IDelivery;
    session_id: string;
  }) {
    const { you_id, delivery, session_id } = options;

    if (!session_id) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Payment session_id was not added as query param on request`,
        },
      };
      return serviceMethodResults;
    }

    if (session_id !== delivery.payment_session_id) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Payment session_id does not match with delivery`,
        },
      };
      return serviceMethodResults;
    }

    const updatesobj: PlainObject = {};
    updatesobj.payment_session_id = '';
    const updates = await update_delivery(delivery.id, updatesobj);

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Payment session canceled`,
        data: updates,
      },
    };
    return serviceMethodResults;
  }

  static async get_user_stats(user_id: number) {
    const ratings_stats = await get_user_ratings_stats_via_model(
      CarryUserRatings,
      user_id,
    );
    const deliveries_count = await get_user_deliveries_count(user_id);
    const delivering_completed_count =
      await get_user_delivering_completed_count(user_id);
    const delivering_inprogress_count =
      await get_user_delivering_inprogress_count(user_id);

    const data = {
      ...ratings_stats,
      deliveries_count,
      delivering_completed_count,
      delivering_inprogress_count,
    };

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `User ratings status`,
        data,
      },
    };
    return serviceMethodResults;
  }

  static async pay_carrier(options: { you: IUser; delivery: IDelivery }) {
    const { you, delivery } = options;

    if (delivery.owner_id !== you.id) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `You are not the owner of this delivery.`,
        },
      };
      return serviceMethodResults;
    }

    if (delivery.completed) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Delivery is already completed`,
        },
      };
      return serviceMethodResults;
    }

    if (
      !delivery.owner?.stripe_account_verified ||
      !delivery.owner?.stripe_account_id
    ) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Owner's stripe account is not setup`,
        },
      };
      return serviceMethodResults;
    }

    if (
      !delivery.carrier?.stripe_account_verified ||
      !delivery.carrier?.stripe_account_id
    ) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Carrier's stripe account is not setup`,
        },
      };
      return serviceMethodResults;
    }

    // try charging customer for delivery listing
    let payment_intent: Stripe.PaymentIntent;
    const is_subscription_active: boolean = (
      await UsersService.is_subscription_active(delivery.owner!)
    ).info.data as boolean;
    const chargeFeeData = StripeService.add_on_stripe_processing_fee(
      delivery.payout,
      is_subscription_active,
    );

    try {
      // https://stripe.com/docs/payments/save-during-payment
      const paymentIntentCreateData: Stripe.PaymentIntentCreateParams = {
        description: `${process.env.APP_NAME} - payment for delivery listing: ${delivery.title}`,
        amount: chargeFeeData.final_total,
        currency: 'usd',

        customer: you.stripe_customer_account_id,
        payment_method: delivery.payment_method_id,
        application_fee_amount: chargeFeeData.app_fee,
        transfer_data: {
          destination: delivery.carrier!.stripe_account_id,
        },

        off_session: true,
        confirm: true,
        metadata: {
          delivery_id: delivery.id,
          payment_intent_event: CARRY_EVENT_TYPES.DELIVERY_COMPLETED,
          target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY,
          target_id: delivery.id,
        },
      };

      console.log({ paymentIntentCreateData });

      payment_intent = await StripeService.stripe.paymentIntents.create(
        paymentIntentCreateData,
      );
    } catch (e) {
      console.log(e);
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Could not charge payment method`,
          error: e,
        },
      };
      return serviceMethodResults;
    }

    // record the transaction
    const payment_intent_action = await StripeActions.create({
      action_event: STRIPE_ACTION_EVENTS.PAYMENT_INTENT,
      action_id: payment_intent.id,
      action_metadata: null,
      target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY,
      target_id: delivery.id,
      target_metadata: null,
      status: TRANSACTION_STATUS.COMPLETED,
    });

    console.log(`Delivery paid successfully. Delivery ID:`, delivery.id, {
      chargeFeeData,
      payment_intent,
      payment_intent_action: payment_intent_action.toJSON(),
    });

    const deliveryCompletedResults =
      await DeliveriesService.mark_delivery_as_completed({
        you_id: you.id,
        delivery,
      });

    deliveryCompletedResults.info.message &&
      console.log(deliveryCompletedResults.info.message);

    if (deliveryCompletedResults.error) {
      return deliveryCompletedResults;
    }

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Payment successful!`,
        data: deliveryCompletedResults.info.data,
      },
    };
    return serviceMethodResults;
  }

  static async leave_delivery_owner_review(options: {
    you: IUser;
    delivery: IDelivery;
    data: any;
    image?: UploadedFile | string;
  }) {
    // you = carrier

    const { you, data, delivery, image } = options;

    const createObj: any = {
      writer_id: you.id,
      user_id: delivery.owner_id,
      delivery_id: delivery.id,
    };

    // validate inputs
    const dataValidation = validateData({
      data,
      validators: delivery_carrier_review_required_props,
      mutateObj: createObj,
    });
    if (dataValidation.error) {
      return dataValidation;
    }

    const imageValidation = await validateAndUploadImageFile(image, {
      treatNotFoundAsError: false,
      mutateObj: createObj,
      id_prop: 'image_id',
      link_prop: 'image_link',
    });
    if (imageValidation.error) {
      return imageValidation;
    }

    const new_review = await leave_delivery_review(createObj);

    create_notification_and_send({
      from_id: you.id,
      to_id: delivery.owner_id!,
      event: CARRY_EVENT_TYPES.NEW_DELIVERY_OWNER_REVIEW,
      target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY,
      target_id: delivery.id,

      to_phone: delivery.owner?.deliverme_settings?.phone || delivery.owner?.phone,

      extras_data: {
        delivery_id: delivery.id,
        data: new_review,
        user_id: you.id,
        user: delivery.carrier,
      },
    }).then((notification: INotification) => {
      ExpoPushNotificationsService.sendUserPushNotification({
        user_id: notification.to_id,
        message: notification.message!,
        data: { delivery_id: delivery.id },
      });
    });

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Review created!`,
        data: new_review,
      },
    };
    return serviceMethodResults;
  }

  static async leave_delivery_carrier_review(options: {
    you: IUser;
    delivery: IDelivery;
    data: any;
    image?: UploadedFile | string;
  }) {
    // you = owner

    const { you, data, delivery, image } = options;

    const createObj: any = {
      writer_id: you.id,
      user_id: delivery.carrier_id,
      delivery_id: delivery.id,
    };

    // validate inputs
    const dataValidation = validateData({
      data,
      validators: delivery_carrier_review_required_props,
      mutateObj: createObj,
    });
    if (dataValidation.error) {
      return dataValidation;
    }

    const imageValidation = await validateAndUploadImageFile(image, {
      treatNotFoundAsError: false,
      mutateObj: createObj,
      id_prop: 'image_id',
      link_prop: 'image_link',
    });
    if (imageValidation.error) {
      return imageValidation;
    }

    const new_review = await leave_delivery_review(createObj);

    create_notification_and_send({
      from_id: you.id,
      to_id: delivery.carrier_id!,
      event: CARRY_EVENT_TYPES.NEW_DELIVERY_CARRIER_REVIEW,
      target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY,
      target_id: delivery.id,

      to_phone:
        delivery.carrier?.deliverme_settings?.phone || delivery.carrier?.phone,

      extras_data: {
        delivery_id: delivery.id,
        data: new_review,
        user_id: you.id,
        user: delivery.owner,
      },
    }).then((notification) => {
      ExpoPushNotificationsService.sendUserPushNotification({
        user_id: notification.to_id,
        message: notification.message!,
        data: { delivery_id: delivery.id },
      });
    });

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Review created!`,
        data: new_review,
      },
    };
    return serviceMethodResults;
  }

  static async pay_carrier_via_transfer(options: {
    you: IUser;
    delivery: IDelivery;
  }) {
    const { you, delivery } = options;

    if (delivery.owner_id !== you.id) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `You are not the owner of this delivery.`,
        },
      };
      return serviceMethodResults;
    }

    if (delivery.completed) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Delivery is already completed`,
        },
      };
      return serviceMethodResults;
    }

    if (
      !delivery.owner?.stripe_account_verified ||
      !delivery.owner?.stripe_account_id
    ) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Owner's stripe account is not setup`,
        },
      };
      return serviceMethodResults;
    }

    if (
      !delivery.carrier?.stripe_account_verified ||
      !delivery.carrier?.stripe_account_id
    ) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Carrier's stripe account is not setup`,
        },
      };
      return serviceMethodResults;
    }

    const balance = await StripeService.stripe.balance.retrieve();
    console.log({ balance }, JSON.stringify(balance));

    const payment_intent = await StripeService.stripe.paymentIntents.retrieve(
      delivery.payment_intent_id,
      { expand: ['charges'] },
    );
    // const was_subscribed: boolean = payment_intent.metadata['was_subscribed'] === 'true' ? true : false;
    // const chargeFeeData = StripeService.add_on_stripe_processing_fee(delivery.payout, was_subscribed);

    const transferAmount = delivery.payout * 100;
    const carrierHasMembershipResults =
      await UsersService.is_subscription_active(delivery.carrier! as IUser);
    const deduction = Math.ceil(transferAmount * 0.1);
    const useTransferAmount = carrierHasMembershipResults.info.data
      ? transferAmount
      : transferAmount - deduction;
    const charge_id = payment_intent['charges'].data[0].id;
    console.log({
      payment_intent_id: payment_intent.id,
      charge_id,
      transferAmount,
      deduction,
      useTransferAmount,
    });

    // try transferring
    let transfer: Stripe.Transfer;
    try {
      const transferCreateData: Stripe.TransferCreateParams = {
        description: `${process.env.APP_NAME} - payment for delivery listing: ${delivery.title}`,
        amount: useTransferAmount,
        currency: 'usd',
        destination: delivery.carrier!.stripe_account_id,
        source_transaction: charge_id,

        metadata: {
          delivery_id: delivery.id,
          transfer_event: CARRY_EVENT_TYPES.DELIVERY_COMPLETED,
          target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY,
          target_id: delivery.id,
        },
      };

      console.log({ transferCreateData });

      transfer = await StripeService.stripe.transfers.create(
        transferCreateData,
      );
    } catch (e) {
      console.log(e);
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Could not transfer...`,
          error: e,
        },
      };
      return serviceMethodResults;
    }

    // record the transaction
    const transfer_action = await StripeActions.create({
      action_event: STRIPE_ACTION_EVENTS.TRANSFER,
      action_id: transfer.id,
      action_metadata: null,
      target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY,
      target_id: delivery.id,
      target_metadata: null,
      status: TRANSACTION_STATUS.COMPLETED,
    });

    console.log(
      `Delivery paid successfully via transfer. Delivery ID:`,
      delivery.id,
      {
        transfer,
        transfer_action: transfer_action.toJSON(),
      },
    );

    const deliveryCompletedResults =
      await DeliveriesService.mark_delivery_as_completed({
        you_id: you.id,
        delivery,
      });

    deliveryCompletedResults.info.message &&
      console.log(deliveryCompletedResults.info.message);

    if (deliveryCompletedResults.error) {
      return deliveryCompletedResults;
    }

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Payment successful!`,
        data: deliveryCompletedResults.info.data,
      },
    };
    return serviceMethodResults;
  }

  static async carrier_self_pay(options: { you: IUser; delivery: IDelivery }) {
    /*
      after a certain amount of time after delivering, carrier can receive funds if the delivery owner does not dispute
    */

    if (options.delivery.owner_id !== options.you.id) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `You are not the carrier of this delivery.`,
        },
      };
      return serviceMethodResults;
    }

    if (!!options.delivery.datetime_delivered) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Not delivered yet.`,
        },
      };
      return serviceMethodResults;
    }

    // check how long it has been since delivery marked as delivered
    const momentNow = moment(new Date());
    const momentDelivered = moment(options.delivery.datetime_delivered);
    const momentDiff = momentDelivered.diff(momentNow);
    const hoursSinceDelivered = moment.duration(momentDiff).asHours();
    const atLeast8HoursAgo = hoursSinceDelivered >= 8;

    if (!atLeast8HoursAgo) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.OK,
        error: false,
        info: {
          message: `Not 8 hours since delivering to self pay`,
        },
      };
      return serviceMethodResults;
    }

    const dispute = await DeliveryDisputes.findOne({
      where: { delivery_id: options.delivery.id },
    });
    if (!!dispute) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.OK,
        error: false,
        info: {
          message: `Cannot self pay during active dispute`,
        },
      };
      return serviceMethodResults;
    }

    const results = await DeliveriesService.pay_carrier_via_transfer({
      you: options.delivery.owner!,
      delivery: options.delivery,
    });
    return results;
  }

  static async request_carrier_location(options: {
    you: IUser;
    delivery: IDelivery;
  }) {
    const { you, delivery } = options;

    if (delivery.carrier_shared_location) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Carrier already shared location`,
        },
      };
      return serviceMethodResults;
    }

    let carrier_tracking_request =
      await get_delivery_carrier_location_request_pending(delivery.id);
    if (carrier_tracking_request) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Carrier location already requested`,
          data: carrier_tracking_request,
        },
      };
      return serviceMethodResults;
    }

    const updates = await set_delivery_carrier_location_requested(
      delivery.id,
      true,
    );
    carrier_tracking_request = await create_delivery_carrier_location_request(
      delivery.id,
    );

    create_notification({
      from_id: you.id,
      to_id: delivery.carrier_id!,
      event: CARRY_EVENT_TYPES.CARRIER_LOCATION_REQUESTED,
      target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY,
      target_id: delivery.id,
    }).then(async (notification_model) => {
      const notification = await populate_carry_notification_obj(
        notification_model,
      );
      ExpoPushNotificationsService.sendUserPushNotification({
        user_id: notification.to_id,
        message: notification.message!,
        data: { delivery_id: delivery.id },
      });
      CommonSocketEventsHandler.emitEventToUserSockets({
        user_id: delivery.carrier_id!,
        event: CARRY_EVENT_TYPES.CARRIER_LOCATION_REQUESTED,
        event_data: {
          data: {
            delivery_id: delivery.id,
            updates,
            carrier_tracking_request,
          },
          message: notification.message || `Carrier location requested!`,
          user: you.id,
          notification,
        },
      });

      const to_phone_number =
        delivery.carrier?.deliverme_settings?.phone || delivery.carrier?.phone;
      if (!!to_phone_number && validatePhone(to_phone_number)) {
        send_sms({
          to_phone_number,
          message: notification.message,
        });
      }
    });

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Carrier location requested`,
        data: carrier_tracking_request,
      },
    };
    return serviceMethodResults;
  }

  static async cancel_request_carrier_location(options: {
    you: IUser;
    delivery: IDelivery;
  }) {
    const { you, delivery } = options;

    if (delivery.carrier_shared_location) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Carrier already shared location`,
        },
      };
      return serviceMethodResults;
    }

    let carrier_tracking_request =
      await get_delivery_carrier_location_request_pending(delivery.id);
    if (!carrier_tracking_request) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Carrier location not requested`,
          data: carrier_tracking_request,
        },
      };
      return serviceMethodResults;
    }

    const updates = await set_delivery_carrier_location_requested(
      delivery.id,
      false,
    );
    await carrier_tracking_request.update(
      { status: STATUSES.CANCELED },
      { fields: [`status`] },
    );

    create_notification({
      from_id: you.id,
      to_id: delivery.carrier_id!,
      event: CARRY_EVENT_TYPES.CARRIER_LOCATION_REQUEST_CANCELED,
      target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY,
      target_id: delivery.id,
    }).then(async (notification_model) => {
      const notification = await populate_carry_notification_obj(
        notification_model,
      );
      ExpoPushNotificationsService.sendUserPushNotification({
        user_id: notification.to_id,
        message: notification.message!,
        data: { delivery_id: delivery.id },
      });
      CommonSocketEventsHandler.emitEventToUserSockets({
        user_id: delivery.carrier_id!,
        event: CARRY_EVENT_TYPES.CARRIER_LOCATION_REQUEST_CANCELED,
        event_data: {
          data: carrier_tracking_request,
          message: notification.message || `Carrier location request canceled!`,
          user: you,
          notification,
        },
      });

      const to_phone_number =
        delivery.carrier?.deliverme_settings?.phone || delivery.carrier?.phone;
      if (!!to_phone_number && validatePhone(to_phone_number)) {
        send_sms({
          to_phone_number,
          message: notification.message,
        });
      }
    });

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Carrier location request canceled`,
        data: carrier_tracking_request,
      },
    };
    return serviceMethodResults;
  }

  static async accept_request_carrier_location(options: {
    you: IUser;
    delivery: IDelivery;
  }) {
    const { you, delivery } = options;

    if (delivery.carrier_shared_location) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Carrier already shared location`,
        },
      };
      return serviceMethodResults;
    }

    let carrier_tracking_request =
      await get_delivery_carrier_location_request_pending(delivery.id);
    if (!carrier_tracking_request) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Carrier location not requested`,
          data: carrier_tracking_request,
        },
      };
      return serviceMethodResults;
    }

    const updates = await set_delivery_carrier_shared_location(
      delivery.id,
      true,
    );
    await carrier_tracking_request.update(
      { status: STATUSES.ACCEPTED },
      { fields: [`status`] },
    );

    create_notification({
      from_id: you.id,
      to_id: delivery.owner_id,
      event: CARRY_EVENT_TYPES.CARRIER_LOCATION_REQUEST_ACCEPTED,
      target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY,
      target_id: delivery.id,
    }).then(async (notification_model) => {
      const notification = await populate_carry_notification_obj(
        notification_model,
      );
      ExpoPushNotificationsService.sendUserPushNotification({
        user_id: notification.to_id,
        message: notification.message!,
        data: { delivery_id: delivery.id },
      });
      CommonSocketEventsHandler.emitEventToUserSockets({
        user_id: delivery.owner_id,
        event: CARRY_EVENT_TYPES.CARRIER_LOCATION_REQUEST_ACCEPTED,
        event_data: {
          data: {
            delivery_id: delivery.id,
            updates,
            carrier_tracking_request,
          },
          message: notification.message || `Carrier location request accepted!`,
          user: you,
          notification,
        },
      });

      const to_phone_number =
        delivery.owner?.deliverme_settings?.phone || delivery.owner?.phone;
      if (!!to_phone_number && validatePhone(to_phone_number)) {
        send_sms({
          to_phone_number,
          message: notification.message,
        });
      }
    });

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Carrier location request accepted`,
        data: carrier_tracking_request,
      },
    };
    return serviceMethodResults;
  }

  static async decline_request_carrier_location(options: {
    you: IUser;
    delivery: IDelivery;
  }) {
    const { you, delivery } = options;

    if (delivery.carrier_shared_location) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Carrier already shared location`,
        },
      };
      return serviceMethodResults;
    }

    let carrier_tracking_request =
      await get_delivery_carrier_location_request_pending(delivery.id);
    if (!carrier_tracking_request) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Carrier location not requested`,
          data: carrier_tracking_request,
        },
      };
      return serviceMethodResults;
    }

    const updates = await set_delivery_carrier_shared_location(
      delivery.id,
      false,
    );
    await carrier_tracking_request.update(
      { status: STATUSES.DECLINED },
      { fields: [`status`] },
    );

    create_notification({ 
      from_id: you.id,
      to_id: delivery.owner_id,
      event: CARRY_EVENT_TYPES.CARRIER_LOCATION_REQUEST_DECLINED,
      target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY,
      target_id: delivery.id,
    }).then(async (notification_model) => {
      const notification = await populate_carry_notification_obj(
        notification_model,
      );
      ExpoPushNotificationsService.sendUserPushNotification({
        user_id: notification.to_id,
        message: notification.message!,
        data: { delivery_id: delivery.id },
      });
      CommonSocketEventsHandler.emitEventToUserSockets({
        user_id: delivery.owner_id,
        event: CARRY_EVENT_TYPES.CARRIER_LOCATION_REQUEST_DECLINED,
        event_data: {
          data: {
            delivery_id: delivery.id,
            updates,
            carrier_tracking_request,
          },
          message: notification.message || `Carrier location request declined!`,
          user: you,
          notification,
        },
      });

      const to_phone_number =
        delivery.owner?.deliverme_settings?.phone || delivery.owner?.phone;
      if (!!to_phone_number && validatePhone(to_phone_number)) {
        send_sms({
          to_phone_number,
          message: notification.message,
        });
      }
    });

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Carrier location request declined`,
        data: updates,
      },
    };
    return serviceMethodResults;
  }

  static async carrier_share_location(options: {
    you: IUser;
    delivery: IDelivery;
  }) {
    const { you, delivery } = options;

    if (delivery.carrier_shared_location) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Carrier already shared location`,
        },
      };
      return serviceMethodResults;
    }

    const updates = await set_delivery_carrier_shared_location(
      delivery.id,
      true,
    );

    create_notification({
      from_id: you.id,
      to_id: delivery.owner_id,
      event: CARRY_EVENT_TYPES.CARRIER_LOCATION_SHARED,
      target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY,
      target_id: delivery.id,
    }).then(async (notification_model) => {
      const notification = await populate_carry_notification_obj(
        notification_model,
      );
      ExpoPushNotificationsService.sendUserPushNotification({
        user_id: notification.to_id,
        message: notification.message!,
        data: { delivery_id: delivery.id },
      });
      CommonSocketEventsHandler.emitEventToUserSockets({
        user_id: delivery.owner_id,
        event: CARRY_EVENT_TYPES.CARRIER_LOCATION_SHARED,
        event_data: {
          data: {
            delivery_id: delivery.id,
            updates,
          },
          message: notification.message || `Carrier location shared!`,
          user: you,
          notification,
        },
      });

      const to_phone_number =
        delivery.owner?.deliverme_settings?.phone || delivery.owner?.phone;
      if (!!to_phone_number && validatePhone(to_phone_number)) {
        send_sms({
          to_phone_number,
          message: notification.message,
        });
      }
    });

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Carrier location shared`,
        data: updates,
      },
    };
    return serviceMethodResults;
  }

  static async carrier_unshare_location(options: {
    you: IUser;
    delivery: IDelivery;
  }) {
    const { you, delivery } = options;

    if (!delivery.carrier_shared_location) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Carrier not sharing location`,
        },
      };
      return serviceMethodResults;
    }

    const updates = await set_delivery_carrier_shared_location(
      delivery.id,
      false,
    );

    create_notification({
      from_id: you.id,
      to_id: delivery.owner_id,
      event: CARRY_EVENT_TYPES.CARRIER_LOCATION_UNSHARED,
      target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY,
      target_id: delivery.id,
    }).then(async (notification_model) => {
      const notification = await populate_carry_notification_obj(
        notification_model,
      );
      ExpoPushNotificationsService.sendUserPushNotification({
        user_id: notification.to_id,
        message: notification.message!,
        data: { delivery_id: delivery.id },
      });
      CommonSocketEventsHandler.emitEventToUserSockets({
        user_id: delivery.owner_id,
        event: CARRY_EVENT_TYPES.CARRIER_LOCATION_UNSHARED,
        event_data: {
          data: {
            delivery_id: delivery.id,
            updates,
          },
          message: notification.message || `Carrier location unshared!`,
          user: you,
          notification,
        },
      });

      const to_phone_number =
        delivery.owner?.deliverme_settings?.phone || delivery.owner?.phone;
      if (!!to_phone_number && validatePhone(to_phone_number)) {
        send_sms({
          to_phone_number,
          message: notification.message,
        });
      }
    });

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Carrier location unshared`,
        data: updates,
      },
    };
    return serviceMethodResults;
  }

  static async carrier_update_location(options: {
    you: IUser;
    delivery: IDelivery;
    carrier_latest_lat: number;
    carrier_latest_lng: number;
  }) {
    const updates = await set_delivery_carrier_lat_lng_location({
      id: options.delivery.id,
      carrier_latest_lat: options.carrier_latest_lat,
      carrier_latest_lng: options.carrier_latest_lng,
    });

    const new_tracking_location_update =
      await create_delivery_carrier_lat_lng_location_update({
        delivery_id: options.delivery.id,
        lat: options.carrier_latest_lat,
        lng: options.carrier_latest_lng,
      });

    CommonSocketEventsHandler.emitEventToUserSockets({
      user_id: options.delivery.owner_id,
      event: CARRY_EVENT_TYPES.CARRIER_LOCATION_UPDATED,
      event_data: {
        data: {
          delivery_id: options.delivery.id,
          updates,
          new_tracking_location_update,
        },
        message: `Carrier location updated!`,
        user: options.you,
      },
    });

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Carrier location unshared`,
        data: new_tracking_location_update,
      },
    };
    return serviceMethodResults;
  }

  static async create_delivery_dispute(options: {
    you: IUser;
    delivery: IDelivery;
    data: any;
    image: UploadedFile | string;
  }) {
    const { you, data, delivery, image } = options;

    const delivery_id = delivery.id;
    const creator_id = you.id;
    const user_id = (
      you.id === delivery.owner_id ? delivery.carrier_id : delivery.owner_id
    )!;

    const createObj: any = {
      creator_id,
      user_id,
      delivery_id,
      status: DeliveryDisputeStatus.OPEN,
    };

    // validate inputs
    const dataValidation = validateData({
      data,
      validators: create_delivery_dispute_required_props,
      mutateObj: createObj,
    });
    if (dataValidation.error) {
      return dataValidation;
    }

    const imageValidation = await validateAndUploadImageFile(image, {
      treatNotFoundAsError: false,
      mutateObj: createObj,
      id_prop: 'image_id',
      link_prop: 'image_link',
    });
    if (imageValidation.error) {
      return imageValidation;
    }

    const new_dispute = await create_delivery_dispute(createObj);
    const to_phone =
      you.id === delivery.owner_id
        ? delivery.carrier?.deliverme_settings?.phone || delivery.carrier?.phone
        : delivery.owner?.deliverme_settings?.phone || delivery.owner?.phone;

    create_notification_and_send({
      from_id: you.id,
      to_id: user_id,
      event: CARRY_EVENT_TYPES.NEW_DELIVERY_DISPUTE,
      target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY,
      target_id: delivery.id,

      to_phone,

      extras_data: {
        delivery_id: delivery.id,
        data: new_dispute,
        user_id: you.id,
        user: delivery.owner,
      },
    }).then((notification) => {
      ExpoPushNotificationsService.sendUserPushNotification({
        user_id: notification.to_id,
        message: notification.message!,
        data: { delivery_id },
      });
    });

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Dispute created!`,
        data: new_dispute,
      },
    };
    return serviceMethodResults;
  }

  static async create_delivery_dispute_log(options: {
    you: IUser;
    delivery: IDelivery;
    delivery_dispute: IDeliveryDispute;
    data: any;
    image: UploadedFile | string;
  }) {
    const { you, data, delivery, image, delivery_dispute } = options;

    const delivery_id = delivery.id;
    const creator_id = you.id;
    const user_id = (
      you.id === delivery.owner_id ? delivery.carrier_id : delivery.owner_id
    )!;

    const createObj: any = {
      creator_id,
      user_id,
      delivery_id,
      dispute_id: delivery_dispute.id,
    };

    // validate inputs
    const dataValidation = validateData({
      data,
      validators: create_delivery_dispute_log_required_props,
      mutateObj: createObj,
    });
    if (dataValidation.error) {
      return dataValidation;
    }

    const imageValidation = await validateAndUploadImageFile(image, {
      treatNotFoundAsError: false,
      mutateObj: createObj,
      id_prop: 'image_id',
      link_prop: 'image_link',
    });
    if (imageValidation.error) {
      return imageValidation;
    }

    const new_dispute_log = await create_delivery_dispute_log(createObj);
    const to_phone =
      you.id === delivery.owner_id
        ? delivery.carrier?.deliverme_settings?.phone || delivery.carrier?.phone
        : delivery.owner?.deliverme_settings?.phone || delivery.owner?.phone;

    create_notification_and_send({
      from_id: you.id,
      to_id: user_id,
      event: CARRY_EVENT_TYPES.NEW_DELIVERY_DISPUTE_LOG,
      target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY_DISPUTE,
      target_id: delivery_dispute.id,

      to_phone,

      extras_data: {
        delivery_id: delivery.id,
        dispute_id: delivery_dispute.id,
        data: new_dispute_log,
        user_id: you.id,
        user: delivery.owner,
      },
    }).then((notification) => {
      ExpoPushNotificationsService.sendUserPushNotification({
        user_id: notification.to_id,
        message: notification.message!,
        data: { delivery_id },
      });
    });

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Dispute log created!`,
        data: new_dispute_log,
      },
    };
    return serviceMethodResults;
  }

  static async create_delivery_dispute_customer_service_message(options: {
    you: IUser;
    delivery: IDelivery;
    delivery_dispute: IDeliveryDispute;
    data: any;
    image: UploadedFile | string;
  }) {
    const { you, data, delivery, image, delivery_dispute } = options;

    const delivery_id = delivery.id;
    const user_id = you.id;
    const createObj: any = {
      user_id,
      delivery_id,
      dispute_id: delivery_dispute.id,
    };

    data['is_from_cs'] = false;

    // validate inputs
    const dataValidation = validateData({
      data,
      validators:
        create_delivery_dispute_customer_support_message_required_props,
      mutateObj: createObj,
    });
    if (dataValidation.error) {
      return dataValidation;
    }

    const imageValidation = await validateAndUploadImageFile(image, {
      treatNotFoundAsError: false,
      mutateObj: createObj,
      id_prop: 'image_id',
      link_prop: 'image_link',
    });
    if (imageValidation.error) {
      return imageValidation;
    }

    const new_dispute_message =
      await create_delivery_dispute_customer_service_message(createObj);
    const to_phone = undefined;

    // create_notification_and_send({
    //   from_id: you.id,
    //   to_id: user_id,
    //   event: CARRY_EVENT_TYPES.NEW_DELIVERY_DISPUTE_LOG,
    //       //   target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY_DISPUTE,
    //   target_id: delivery_dispute.id,

    //
    //   to_phone,

    //   extras_data: {
    //     delivery_id: delivery.id,
    //     dispute_id: delivery_dispute.id,
    //     data: new_dispute_log,
    //     user_id: you.id,
    //     user: delivery.owner,
    //   },
    // }).then((notification) => {
    //   ExpoPushNotificationsService.sendUserPushNotification({
    //     user_id: notification.to_id,
    //     message: notification.message!,
    //     data: { delivery_id }
    //   });
    // });

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Dispute Message Created!`,
        data: new_dispute_message,
      },
    };
    return serviceMethodResults;
  }

  static async make_delivery_dispute_settlement_offer(options: {
    you: IUser;
    delivery: IDelivery;
    delivery_dispute: IDeliveryDispute;
    data: any;
  }) {
    const { you, data, delivery, delivery_dispute } = options;

    const delivery_id = delivery.id;
    const creator_id = you.id;
    const user_id = (
      you.id === delivery.owner_id ? delivery.carrier_id : delivery.owner_id
    )!;

    const createObj: any = {
      creator_id,
      user_id,
      delivery_id,
      dispute_id: delivery_dispute.id,
      status: DeliveryDisputeSettlementOfferStatus.PENDING,
    };

    // validate inputs
    const dataValidation = validateData({
      data,
      validators: create_delivery_dispute_settlement_required_props,
      mutateObj: createObj,
    });
    if (dataValidation.error) {
      return dataValidation;
    }

    const new_offer = await create_delivery_dispute_settlement_offer(createObj);
    const to_phone =
      you.id === delivery.owner_id
        ? delivery.carrier?.deliverme_settings?.phone || delivery.carrier?.phone
        : delivery.owner?.deliverme_settings?.phone || delivery.owner?.phone;

    create_notification_and_send({
      from_id: you.id,
      to_id: user_id,
      event: CARRY_EVENT_TYPES.DELIVERY_DISPUTE_SETTLEMENT_OFFER,
      target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY_DISPUTE,
      target_id: delivery_dispute.id,

      to_phone,

      extras_data: {
        delivery_id: delivery.id,
        dispute_id: delivery_dispute.id,
        data: new_offer,
        user_id: you.id,
        user: delivery.owner,
      },
    }).then((notification) => {
      ExpoPushNotificationsService.sendUserPushNotification({
        user_id: notification.to_id,
        message: notification.message!,
        data: { delivery_id },
      });
    });

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Dispute Settlement Offer created!`,
        data: new_offer,
      },
    };
    return serviceMethodResults;
  }

  static async cancel_delivery_dispute_settlement_offer(options: {
    you: IUser;
    delivery: IDelivery;
    delivery_dispute: IDeliveryDispute;
    settlement_offer: IDeliveryDisputeSettlementOffer;
  }) {
    const { you, delivery, delivery_dispute, settlement_offer } = options;

    const delivery_id = delivery.id;
    const creator_id = you.id;
    const user_id = (
      you.id === delivery.owner_id ? delivery.carrier_id : delivery.owner_id
    )!;

    const updates = await update_delivery_dispute_settlement_offer_status(
      settlement_offer.id,
      DeliveryDisputeSettlementOfferStatus.CANCELED,
    );
    const to_phone =
      you.id === delivery.owner_id
        ? delivery.carrier?.deliverme_settings?.phone || delivery.carrier?.phone
        : delivery.owner?.deliverme_settings?.phone || delivery.owner?.phone;

    create_notification_and_send({
      from_id: you.id,
      to_id: user_id,
      event: CARRY_EVENT_TYPES.DELIVERY_DISPUTE_SETTLEMENT_OFFER_CANCELED,
      target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY_DISPUTE,
      target_id: delivery_dispute.id,

      to_phone,

      extras_data: {
        delivery_id: delivery.id,
        dispute_id: delivery_dispute.id,
        data: updates,
        user_id: you.id,
        user: delivery.owner,
      },
    }).then((notification) => {
      ExpoPushNotificationsService.sendUserPushNotification({
        user_id: notification.to_id,
        message: notification.message!,
        data: { delivery_id, dispute_id: delivery_dispute.id },
      });
    });

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Dispute Settlement Offer canceled`,
        data: updates,
      },
    };
    return serviceMethodResults;
  }

  static async accept_delivery_dispute_settlement_offer(options: {
    you: IUser;
    delivery: IDelivery;
    delivery_dispute: IDeliveryDispute;
    settlement_offer: IDeliveryDisputeSettlementOffer;
    payment_method_id: string;
  }) {
    // verify needed data/inputs
    const {
      you,
      delivery,
      delivery_dispute,
      settlement_offer,
      payment_method_id,
    } = options;
    const delivery_id = delivery.id;
    const creator_id = you.id;
    const user_id = (
      you.id === delivery.owner_id ? delivery.carrier_id : delivery.owner_id
    )!;
    const user = (
      you.id === delivery.owner_id ? delivery.carrier : delivery.owner
    )!;
    if (!user) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Settlement creator's user info not found`,
        },
      };
      return serviceMethodResults;
    }

    // verify payment method belongs to user
    const user_payment_methods =
      await UsersService.get_user_customer_cards_payment_methods(
        you.stripe_customer_account_id,
      );
    const payment_methods = user_payment_methods.info
      .data! as Stripe.PaymentMethod[];
    const pm = payment_methods.find((p) => p.id === payment_method_id);
    if (!pm) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Payment method not attached to user's stripe account`,
        },
      };
      return serviceMethodResults;
    }

    // charge the payment method
    const is_subscription_active = (
      await UsersService.is_subscription_active(you)
    ).info.data as boolean;
    const chargeFeeData = StripeService.add_on_stripe_processing_fee(
      settlement_offer.offer_amount,
      is_subscription_active,
    );
    const new_payment_intent: Stripe.PaymentIntent =
      await StripeService.stripe.paymentIntents.create({
        description: `${process.env.APP_NAME} - dispute settlement for delivery: ${delivery.title}`,
        amount: chargeFeeData.final_total,
        currency: 'usd',
        customer: you.stripe_customer_account_id,
        payment_method: payment_method_id,
        off_session: true,
        confirm: true,
        metadata: {
          delivery_id,
          dispuute_id: delivery_dispute.id,
          settlement_offer_id: settlement_offer.id,
        },
      });
    const payment_intent = await StripeService.stripe.paymentIntents.retrieve(
      new_payment_intent.id,
      { expand: ['charges'] },
    );
    // record the transaction
    const payment_action = await StripeActions.create({
      action_event: STRIPE_ACTION_EVENTS.PAYMENT_INTENT,
      action_id: payment_intent.id,

      action_metadata: null,
      target_type:
        CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY_DISPUTE_SETTLEMENT_OFFER,
      target_id: settlement_offer.id,
      target_metadata: null,
      status: TRANSACTION_STATUS.COMPLETED,
    });

    // payment went throough successfully, transfer to recipient stripe account
    const transferAmount = settlement_offer.offer_amount * 100;
    const charge_id = payment_intent['charges'].data[0].id;
    const transfer = await StripeService.stripe.transfers.create({
      description: `${process.env.APP_NAME} - dispute settlement for delivery: ${delivery.title}`,
      amount: transferAmount,
      currency: 'usd',
      destination: user.stripe_account_id,
      source_transaction: charge_id,

      metadata: {
        delivery_id,
        dispuute_id: delivery_dispute.id,
        settlement_offer_id: settlement_offer.id,
        transfer_event:
          CARRY_EVENT_TYPES.DELIVERY_DISPUTE_SETTLEMENT_OFFER_ACCEPTED,
        target_type:
          CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY_DISPUTE_SETTLEMENT_OFFER,
      },
    });
    // record the transfer
    const transfer_action = await StripeActions.create({
      action_event: STRIPE_ACTION_EVENTS.TRANSFER,
      action_id: transfer.id,

      action_metadata: null,
      target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY_DISPUTE,
      target_id: delivery_dispute.id,
      target_metadata: null,
      status: TRANSACTION_STATUS.COMPLETED,
    });

    // charge and transfer completed, mark settlement as accepted
    const new_offer = await update_delivery_dispute_settlement_offer_status(
      settlement_offer.id,
      DeliveryDisputeSettlementOfferStatus.ACCEPTED,
    );
    const to_phone =
      you.id === delivery.owner_id
        ? delivery.carrier?.deliverme_settings?.phone || delivery.carrier?.phone
        : delivery.owner?.deliverme_settings?.phone || delivery.owner?.phone;

    // mark dispute as as resolved
    const dispute_updated = await update_delivery_dispute(delivery_dispute.id, {
      status: DeliveryDisputeStatus.RESOLVED,
    });

    // mark delivery as completed
    const delivery_completed =
      await DeliveriesService.mark_delivery_as_completed({
        you_id: delivery.owner_id,
        delivery,
      });

    if (delivery_completed.error) {
      return delivery_completed;
    }

    // notify other user
    create_notification_and_send({
      from_id: you.id,
      to_id: user_id,
      event: CARRY_EVENT_TYPES.DELIVERY_DISPUTE_SETTLEMENT_OFFER_ACCEPTED,
      target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY_DISPUTE,
      target_id: delivery_dispute.id,

      to_phone,

      extras_data: {
        delivery_id: delivery.id,
        dispute_id: delivery_dispute.id,
        settlement_offer_id: settlement_offer.id,
        data: new_offer,
        user_id: you.id,
        user: delivery.owner,
      },
    }).then((notification) => {
      ExpoPushNotificationsService.sendUserPushNotification({
        user_id: notification.to_id,
        message: notification.message!,
        data: {
          settlement_offer_id: settlement_offer.id,
          delivery_id,
          dispute_id: delivery_dispute.id,
        },
      });
    });

    // return response
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Dispute Settlement Offer Accepted!`,
        data: new_offer,
      },
    };
    return serviceMethodResults;
  }

  static async decline_delivery_dispute_settlement_offer(options: {
    you: IUser;
    delivery: IDelivery;
    delivery_dispute: IDeliveryDispute;
    settlement_offer: IDeliveryDisputeSettlementOffer;
  }) {
    const { you, delivery, delivery_dispute, settlement_offer } = options;

    const delivery_id = delivery.id;
    const creator_id = you.id;
    const user_id = (
      you.id === delivery.owner_id ? delivery.carrier_id : delivery.owner_id
    )!;

    const new_offer = await update_delivery_dispute_settlement_offer_status(
      settlement_offer.id,
      DeliveryDisputeSettlementOfferStatus.DECLINED,
    );
    const to_phone =
      you.id === delivery.owner_id
        ? delivery.carrier?.deliverme_settings?.phone || delivery.carrier?.phone
        : delivery.owner?.deliverme_settings?.phone || delivery.owner?.phone;

    create_notification_and_send({
      from_id: you.id,
      to_id: user_id,
      event: CARRY_EVENT_TYPES.DELIVERY_DISPUTE_SETTLEMENT_OFFER_DECLINED,
      target_type: CARRY_NOTIFICATION_TARGET_TYPES.DELIVERY_DISPUTE,
      target_id: delivery_dispute.id,

      to_phone,

      extras_data: {
        delivery_id: delivery.id,
        dispute_id: delivery_dispute.id,
        data: new_offer,
        user_id: you.id,
        user: delivery.owner,
      },
    }).then((notification) => {
      ExpoPushNotificationsService.sendUserPushNotification({
        user_id: notification.to_id,
        message: notification.message!,
        data: { delivery_id, dispute_id: delivery_dispute.id },
      });
    });

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        message: `Dispute Settlement Offer declined`,
        data: new_offer,
      },
    };
    return serviceMethodResults;
  }

  static async make_delivery_dispute_settlement_invoice(
    you: IUser,
    delivery: IDelivery,
    data: any,
  ) {}

  static async get_delivery_dispute_info_by_delivery_id(dispute_id: number) {
    const results = await get_delivery_dispute_info_by_delivery_id(dispute_id);

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: results,
      },
    };
    return serviceMethodResults;
  }

  static async get_user_dispute_messages_by_user_id_and_dispute_id(
    dispute_id: number,
    user_id: number,
  ) {
    const results = await get_user_dispute_messages_by_user_id_and_dispute_id(
      dispute_id,
      user_id,
    );

    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: results,
      },
    };
    return serviceMethodResults;
  }
}
