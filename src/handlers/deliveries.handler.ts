import { Request, Response } from 'express';
import { HttpStatusCode } from 'src/enums/http-codes.enum';
import { ExpressResponse, ServiceMethodResults } from 'src/interfaces/common.interface';
import { IUser } from '../interfaces/carry.interface';
import { IDelivery, IDeliveryDispute, IDeliveryDisputeSettlementOffer } from '../interfaces/deliverme.interface';
import { DeliveriesService } from '../services/deliveries.service';
// import { UploadedFile } from 'express-fileupload';



export class DeliveriesRequestHandler {

  static async find_available_delivery_by_from_city_and_state(request: Request, response: Response): ExpressResponse {
    const city: string = request.params.city;
    const state: string = request.params.state;
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.find_available_delivery_by_from_city_and_state(city, state);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async find_available_delivery_by_to_city_and_state(request: Request, response: Response): ExpressResponse {
    const city: string = request.params.city;
    const state: string = request.params.state;
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.find_available_delivery_by_to_city_and_state(city, state);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }
  
  static async find_available_delivery(request: Request, response: Response): ExpressResponse {
    const options = {
      you_id: response.locals.you as number,
      criteria: request.body.criteria as string,
      city: request.body.city as string,
      state: request.body.state as string,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.find_available_delivery(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }
  
  static async search_deliveries(request: Request, response: Response): ExpressResponse {
    const options = {
      you_id: response.locals.you.id as number,
      from_city: response.locals.from_city as string,
      from_state: request.body.from_state as string,
      to_city: request.body.to_city as string,
      to_state: request.body.to_state as string,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.search_deliveries(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async browse_recent_deliveries(request: Request, response: Response): ExpressResponse {
    const options: { you_id: number, delivery_id?: number, } = {
      you_id: (response.locals.you?.id as number) || 0
    };
    if (request.params.delivery_id) {
      options.delivery_id = parseInt(request.params.delivery_id);
    }
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.browse_recent_deliveries(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async browse_featured_deliveries(request: Request, response: Response): ExpressResponse {
    const options: { you_id: number, delivery_id?: number, } = {
      you_id: response.locals.you?.id as number
    };
    if (request.params.delivery_id) {
      options.delivery_id = parseInt(request.params.delivery_id);
    }
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.browse_featured_deliveries(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async browse_map_deliveries(request: Request, response: Response): ExpressResponse {
    const options = {
      you_id: response.locals.you?.id as number,
      swLat: parseFloat(request.params.swlat?.toString() || '0'),
      swLng: parseFloat(request.params.swlng?.toString() || '0'),
      neLat: parseFloat(request.params.nelat?.toString() || '0'),
      neLng: parseFloat(request.params.nelng?.toString() || '0'),
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.browse_map_deliveries(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async send_delivery_message(request: Request, response: Response): ExpressResponse {
    const options = {
      you_id: response.locals.you?.id as number,
      delivery: response.locals.delivery_model as IDelivery,
      body: request.body.body as string,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.send_delivery_message(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async get_delivery_by_id(request: Request, response: Response): ExpressResponse {
    const delivery: IDelivery = response.locals.delivery_model;
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: delivery
      }
    };
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async get_delivery_dispute_by_delivery_id(request: Request, response: Response): ExpressResponse {
    const dispute: IDeliveryDispute = response.locals.delivery_dispute_model;
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: dispute
      }
    };
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async get_delivery_dispute_info_by_delivery_id(request: Request, response: Response): ExpressResponse {
    const dispute: IDeliveryDispute = response.locals.delivery_dispute_model;
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: dispute
      }
    };
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async get_user_dispute_messages_by_user_id_and_dispute_id(request: Request, response: Response): ExpressResponse {
    const you: IUser = response.locals.you;
    const delivery_dispute: IDeliveryDispute = response.locals.delivery_dispute_model;
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.get_user_dispute_messages_by_user_id_and_dispute_id(delivery_dispute.id, you.id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }
  
  static async get_user_deliveries_all(request: Request, response: Response): ExpressResponse {
    const user_id: number = parseInt(request.params.user_id, 10);
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.get_user_deliveries_all(user_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async get_user_deliveries(request: Request, response: Response): ExpressResponse {
    const user_id: number = parseInt(request.params.user_id, 10);
    const delivery_id: number | undefined = request.params.delivery_id ? parseInt(request.params.delivery_id, 10) : undefined;
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.get_user_deliveries(user_id, delivery_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async get_user_deliverings_all(request: Request, response: Response): ExpressResponse {
    const user_id: number = parseInt(request.params.user_id, 10);
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.get_user_deliverings_all(user_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async get_user_deliverings(request: Request, response: Response): ExpressResponse {
    const user_id: number = parseInt(request.params.user_id, 10);
    const delivery_id: number | undefined = request.params.delivery_id ? parseInt(request.params.delivery_id, 10) : undefined;
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.get_user_deliverings(user_id, delivery_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async get_user_deliveries_all_slim(request: Request, response: Response): ExpressResponse {
    const user_id: number = parseInt(request.params.user_id, 10);
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.get_user_deliveries_all_slim(user_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async get_user_deliveries_slim(request: Request, response: Response): ExpressResponse {
    const user_id: number = parseInt(request.params.user_id, 10);
    const delivery_id: number | undefined = request.params.delivery_id ? parseInt(request.params.delivery_id, 10) : undefined;
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.get_user_deliveries_slim(user_id, delivery_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async get_user_deliverings_all_slim(request: Request, response: Response): ExpressResponse {
    const user_id: number = parseInt(request.params.user_id, 10);
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.get_user_deliverings_all_slim(user_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async get_user_deliverings_slim(request: Request, response: Response): ExpressResponse {
    const user_id: number = parseInt(request.params.user_id, 10);
    const delivery_id: number | undefined = request.params.delivery_id ? parseInt(request.params.delivery_id, 10) : undefined;
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.get_user_deliverings_slim(user_id, delivery_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async get_user_delivering(request: Request, response: Response): ExpressResponse {
    const you_id: number = parseInt(request.params.you_id, 10);
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.get_user_delivering(you_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async create_delivery(request: Request, response: Response): ExpressResponse {
    const options = {
      you: response.locals.you as IUser,
      data: JSON.parse(request.body.payload) as any,
      delivery_image: request.files && request.files['delivery_image'] || request.body?.delivery_image,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.create_delivery_and_charge(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async update_delivery(request: Request, response: Response): ExpressResponse {
    const options = {
      you: response.locals.you as IUser,
      data: JSON.parse(request.body.payload) as any,
      delivery: response.locals.delivery_model as IDelivery,
      delivery_image: request.files && request.files['delivery_image'] || request.body?.delivery_image,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.update_delivery(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async delete_delivery(request: Request, response: Response): ExpressResponse {
    const delivery = response.locals.delivery_model as IDelivery;
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.delete_delivery_and_refund(delivery);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async assign_delivery(request: Request, response: Response): ExpressResponse {
    const options = {
      you: response.locals.you as IUser,
      delivery: response.locals.delivery_model as IDelivery,
      ignoreNotification: false,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.assign_delivery(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async unassign_delivery(request: Request, response: Response): ExpressResponse {
    const options = {
      you_id: response.locals.you?.id as number,
      delivery: response.locals.delivery_model as IDelivery,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.unassign_delivery(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async create_tracking_update(request: Request, response: Response): ExpressResponse {
    const options = {
      you_id: response.locals.you?.id as number,
      delivery: response.locals.delivery_model as IDelivery,
      data: JSON.parse(request.body.payload) as any,
      tracking_update_image: request.files && request.files['tracking_update_image'] || request.body?.tracking_update_image,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.create_tracking_update(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async add_delivered_picture(request: Request, response: Response): ExpressResponse {
    const options = {
      you_id: response.locals.you.id as number,
      delivery: response.locals.delivery_model as IDelivery,
      delivered_image: request.files && (request.files['delivered_image'] || request.files['image']) || request.body?.delivered_image,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.add_delivered_picture(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async add_from_person_id_picture(request: Request, response: Response): ExpressResponse {
    const options = {
      you_id: response.locals.you.id as number,
      delivery: response.locals.delivery_model as IDelivery,
      image: request.files && request.files['image'] || request.body?.image,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.add_from_person_id_picture(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async add_from_person_sig_picture(request: Request, response: Response): ExpressResponse {
    const options = {
      you_id: response.locals.you.id as number,
      delivery: response.locals.delivery_model as IDelivery,
      image: request.files && request.files['image'] || request.body?.image,
    };
    console.log(`===== add_from_person_sig_picture`, request.body);
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.add_from_person_sig_picture(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async add_to_person_id_picture(request: Request, response: Response): ExpressResponse {
    const options = {
      you_id: response.locals.you.id as number,
      delivery: response.locals.delivery_model as IDelivery,
      image: request.files && request.files['image'] || request.body?.image,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.add_to_person_id_picture(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async add_to_person_sig_picture(request: Request, response: Response): ExpressResponse {
    const options = {
      you_id: response.locals.you.id as number,
      delivery: response.locals.delivery_model as IDelivery,
      image: request.files && request.files['image'] || request.body?.image,
    };
    console.log(`===== add_to_person_sig_picture`, request.body);
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.add_to_person_sig_picture(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async mark_delivery_as_picked_up(request: Request, response: Response): ExpressResponse {
    const options = {
      you_id: response.locals.you?.id as number,
      delivery: response.locals.delivery_model as IDelivery,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.mark_delivery_as_picked_up(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async mark_delivery_as_dropped_off(request: Request, response: Response): ExpressResponse {
    const options = {
      you_id: response.locals.you?.id as number,
      delivery: response.locals.delivery_model as IDelivery,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.mark_delivery_as_dropped_off(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async mark_delivery_as_returned(request: Request, response: Response): ExpressResponse {
    const options = {
      you_id: response.locals.you?.id as number,
      delivery: response.locals.delivery_model as IDelivery,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.mark_delivery_as_returned(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async get_settings(request: Request, response: Response): ExpressResponse {
    const you = response.locals.you as IUser;
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.get_settings(you.id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async update_settings(request: Request, response: Response): ExpressResponse {
    const you = response.locals.you as IUser;
    const data = request.body as any;
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.update_settings(you.id, data);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }
  
  static async create_payment_intent(request: Request, response: Response): ExpressResponse {
    const options = {
      you_id: response.locals.you?.id as number,
      delivery: response.locals.delivery_model as IDelivery,
      host: request.get('origin')! as string,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.create_payment_intent(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async pay_carrier(request: Request, response: Response): ExpressResponse {
    const options = {
      you: response.locals.you! as IUser,
      delivery: response.locals.delivery_model as IDelivery,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.pay_carrier_via_transfer(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }


  static async leave_delivery_owner_review(request: Request, response: Response): ExpressResponse {
    const options = {
      you: response.locals.you as IUser,
      delivery: response.locals.delivery_model as IDelivery,
      data: JSON.parse(request.body.payload) as any,
      image: request.files && request.files['image'] || request.body?.image,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.leave_delivery_owner_review(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async leave_delivery_carrier_review(request: Request, response: Response): ExpressResponse {
    const options = {
      you: response.locals.you as IUser,
      delivery: response.locals.delivery_model as IDelivery,
      data: JSON.parse(request.body.payload) as any,
      image: request.files && request.files['image'] || request.body?.image,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.leave_delivery_carrier_review(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }


  static async create_delivery_dispute(request: Request, response: Response): ExpressResponse {
    const options = {
      you: response.locals.you as IUser,
      delivery: response.locals.delivery_model as IDelivery,
      data: JSON.parse(request.body.payload) as any,
      image: request.files && request.files['image'] || request.body?.image,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.create_delivery_dispute(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async create_delivery_dispute_log(request: Request, response: Response): ExpressResponse {
    const options = {
      you: response.locals.you as IUser,
      delivery: response.locals.delivery_model as IDelivery,
      delivery_dispute: response.locals.delivery_dispute_model as IDeliveryDispute,
      data: JSON.parse(request.body.payload) as any,
      image: request.files && request.files['image'] || request.body?.image,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.create_delivery_dispute_log(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async create_delivery_dispute_customer_service_message(request: Request, response: Response): ExpressResponse {
    const options = {
      you: response.locals.you as IUser,
      delivery: response.locals.delivery_model as IDelivery,
      delivery_dispute: response.locals.delivery_dispute_model as IDeliveryDispute,
      data: JSON.parse(request.body.payload) as any,
      image: request.files && request.files['image'] || request.body?.image,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.create_delivery_dispute_customer_service_message(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async make_delivery_dispute_settlement_offer(request: Request, response: Response): ExpressResponse {
    const options = {
      you: response.locals.you as IUser,
      delivery: response.locals.delivery_model as IDelivery,
      delivery_dispute: response.locals.delivery_dispute_model as IDeliveryDispute,
      data: request.body as any,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.make_delivery_dispute_settlement_offer(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async cancel_delivery_dispute_settlement_offer(request: Request, response: Response): ExpressResponse {
    const options = {
      you: response.locals.you as IUser,
      delivery: response.locals.delivery_model as IDelivery,
      delivery_dispute: response.locals.delivery_dispute_model as IDeliveryDispute,
      settlement_offer: response.locals.settlement_offer_model as IDeliveryDisputeSettlementOffer,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.cancel_delivery_dispute_settlement_offer(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async accept_delivery_dispute_settlement_offer(request: Request, response: Response): ExpressResponse {
    const options = {
      you: response.locals.you as IUser,
      delivery: response.locals.delivery_model as IDelivery,
      delivery_dispute: response.locals.delivery_dispute_model as IDeliveryDispute,
      settlement_offer: response.locals.settlement_offer_model as IDeliveryDisputeSettlementOffer,
      payment_method_id: request.body.payment_method_id as string
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.accept_delivery_dispute_settlement_offer(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }
  
  static async decline_delivery_dispute_settlement_offer(request: Request, response: Response): ExpressResponse {
    const options = {
      you: response.locals.you as IUser,
      delivery: response.locals.delivery_model as IDelivery,
      delivery_dispute: response.locals.delivery_dispute_model as IDeliveryDispute,
      settlement_offer: response.locals.settlement_offer_model as IDeliveryDisputeSettlementOffer,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.decline_delivery_dispute_settlement_offer(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }


  static async payment_success(request: Request, response: Response): ExpressResponse {
    const options = {
      you_id: response.locals.you?.id as number,
      delivery: response.locals.delivery_model as IDelivery,
      session_id: request.query.session_id as string,
      ignoreNotification: true,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.payment_success(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async payment_cancel(request: Request, response: Response): ExpressResponse {
    const options = {
      you_id: response.locals.you?.id as number,
      delivery: response.locals.delivery_model as IDelivery,
      session_id: request.query.session_id as string,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.payment_cancel(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async get_user_stats(request: Request, response: Response): ExpressResponse {
    const user_id = parseInt(request.params.user_id, 10);
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.get_user_stats(user_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async request_carrier_location(request: Request, response: Response): ExpressResponse {
    const options = {
      you: response.locals.you as IUser,
      delivery: response.locals.delivery_model as IDelivery,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.request_carrier_location(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async cancel_request_carrier_location(request: Request, response: Response): ExpressResponse {
    const options = {
      you: response.locals.you as IUser,
      delivery: response.locals.delivery_model as IDelivery,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.cancel_request_carrier_location(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async accept_request_carrier_location(request: Request, response: Response): ExpressResponse {
    const options = {
      you: response.locals.you as IUser,
      delivery: response.locals.delivery_model as IDelivery,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.accept_request_carrier_location(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async decline_request_carrier_location(request: Request, response: Response): ExpressResponse {
    const options = {
      you: response.locals.you as IUser,
      delivery: response.locals.delivery_model as IDelivery,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.decline_request_carrier_location(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async carrier_share_location(request: Request, response: Response): ExpressResponse {
    const options = {
      you: response.locals.you as IUser,
      delivery: response.locals.delivery_model as IDelivery,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.carrier_share_location(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async carrier_unshare_location(request: Request, response: Response): ExpressResponse {
    const options = {
      you: response.locals.you as IUser,
      delivery: response.locals.delivery_model as IDelivery,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.carrier_unshare_location(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async carrier_update_location(request: Request, response: Response): ExpressResponse {
    const options = {
      you: response.locals.you as IUser,
      delivery: response.locals.delivery_model as IDelivery,
      carrier_latest_lat: request.body.lat as number,
      carrier_latest_lng: request.body.lng as number,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.carrier_unshare_location(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }
}