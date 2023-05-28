import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { HttpStatusCode } from '../enums/http-codes.enum';
import { IUser } from '../interfaces/carry.interface';
import { ExpressResponse, ServiceMethodResults } from '../interfaces/common.interface';
import { IDelivery } from '../interfaces/deliverme.interface';
import { get_user_by_id } from '../repos/users.repo';
import { DeliveriesService } from '../services/deliveries.service';



export class DelivermeApiRequestHandler {

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
      you_id: response.locals.api_key_model.user_id as number,
      criteria: request.body.criteria as string,
      city: request.body.city as string,
      state: request.body.state as string,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.find_available_delivery(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }
  
  static async search_deliveries(request: Request, response: Response): ExpressResponse {
    const options = {
      you_id: response.locals.api_key_model.user_id as number,
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
      you_id: (response.locals.api_key_model.user_id as number) || 0
    };
    if (request.params.delivery_id) {
      options.delivery_id = parseInt(request.params.delivery_id);
    }
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.browse_recent_deliveries(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async browse_featured_deliveries(request: Request, response: Response): ExpressResponse {
    const options: { you_id: number, delivery_id?: number, } = {
      you_id: response.locals.api_key_model.user_id as number
    };
    if (request.params.delivery_id) {
      options.delivery_id = parseInt(request.params.delivery_id);
    }
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.browse_featured_deliveries(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async browse_map_deliveries(request: Request, response: Response): ExpressResponse {
    const options = {
      you_id: response.locals.api_key_model.user_id as number,
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
      you_id: response.locals.api_key_model.user_id as number,
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
  
  static async get_user_deliveries_all(request: Request, response: Response): ExpressResponse {
    const user_id: number = parseInt(response.locals.api_key_model.user_id, 10);
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.get_user_deliveries_all(user_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async get_user_deliveries(request: Request, response: Response): ExpressResponse {
    const user_id: number = parseInt(response.locals.api_key_model.user_id, 10);
    const delivery_id: number | undefined = request.params.delivery_id ? parseInt(request.params.delivery_id, 10) : undefined;
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.get_user_deliveries(user_id, delivery_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async get_user_deliverings_all(request: Request, response: Response): ExpressResponse {
    const user_id: number = parseInt(response.locals.api_key_model.user_id, 10);
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.get_user_deliverings_all(user_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async get_user_deliverings(request: Request, response: Response): ExpressResponse {
    const user_id: number = parseInt(response.locals.api_key_model.user_id, 10);
    const delivery_id: number | undefined = request.params.delivery_id ? parseInt(request.params.delivery_id, 10) : undefined;
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.get_user_deliverings(user_id, delivery_id);
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
      delivery_image: request.files && (<UploadedFile> request.files.delivery_image)
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.create_delivery(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async update_delivery(request: Request, response: Response): ExpressResponse {
    const options = {
      you: response.locals.you as IUser,
      data: JSON.parse(request.body.payload) as any,
      delivery: response.locals.delivery_model as IDelivery,
      delivery_image: request.files && (<UploadedFile> request.files.delivery_image)
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.update_delivery(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async delete_delivery(request: Request, response: Response): ExpressResponse {
    const delivery = response.locals.delivery_model as IDelivery;
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.delete_delivery(delivery);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async assign_delivery(request: Request, response: Response): ExpressResponse {
    const you = await get_user_by_id(response.locals.api_key_model.user_id as number);
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.assign_delivery({
      you: you!,
      delivery: response.locals.delivery_model as IDelivery,
      ignoreNotification: false,
    });
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async unassign_delivery(request: Request, response: Response): ExpressResponse {
    const options = {
      you_id: response.locals.api_key_model.user_id as number,
      delivery: response.locals.delivery_model as IDelivery,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.unassign_delivery(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async create_tracking_update(request: Request, response: Response): ExpressResponse {
    const options = {
      you_id: response.locals.api_key_model.user_id as number,
      delivery: response.locals.delivery_model as IDelivery,
      data: JSON.parse(request.body.payload) as any,
      tracking_update_image: request.files && (<UploadedFile> request.files.tracking_update_image),
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.create_tracking_update(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async add_delivered_picture(request: Request, response: Response): ExpressResponse {
    const options = {
      you_id: response.locals.api_key_model.user_id as number,
      delivery: response.locals.delivery_model as IDelivery,
      delivered_image: request.files && (<UploadedFile> request.files.delivered_image),
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.add_delivered_picture(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async mark_delivery_as_picked_up(request: Request, response: Response): ExpressResponse {
    const options = {
      you_id: response.locals.api_key_model.user_id as number,
      delivery: response.locals.delivery_model as IDelivery,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.mark_delivery_as_picked_up(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async mark_delivery_as_dropped_off(request: Request, response: Response): ExpressResponse {
    const options = {
      you_id: response.locals.api_key_model.user_id as number,
      delivery: response.locals.delivery_model as IDelivery,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.mark_delivery_as_dropped_off(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async mark_delivery_as_completed(request: Request, response: Response): ExpressResponse {
    const options = {
      you_id: response.locals.api_key_model.user_id as number,
      delivery: response.locals.delivery_model as IDelivery,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.mark_delivery_as_completed(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async mark_delivery_as_returned(request: Request, response: Response): ExpressResponse {
    const options = {
      you_id: response.locals.api_key_model.user_id as number,
      delivery: response.locals.delivery_model as IDelivery,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.mark_delivery_as_returned(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async get_settings(request: Request, response: Response): ExpressResponse {
    const you_id = response.locals.api_key_model.user_id as number;
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.get_settings(you_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async update_settings(request: Request, response: Response): ExpressResponse {
    const you_id = response.locals.api_key_model.user_id as number;
    const data = request.body as any;
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.update_settings(you_id, data);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }
  

  static async payment_success(request: Request, response: Response): ExpressResponse {
    const options = {
      you_id: response.locals.api_key_model.user_id as number,
      delivery: response.locals.delivery_model as IDelivery,
      session_id: request.query.session_id as string,
      ignoreNotification: true,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.payment_success(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async payment_cancel(request: Request, response: Response): ExpressResponse {
    const options = {
      you_id: response.locals.api_key_model.user_id as number,
      delivery: response.locals.delivery_model as IDelivery,
      session_id: request.query.session_id as string,
    };
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.payment_cancel(options);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  static async get_user_stats(request: Request, response: Response): ExpressResponse {
    const user_id = parseInt(response.locals.api_key_model.user_id, 10);
    const serviceMethodResults: ServiceMethodResults = await DeliveriesService.get_user_stats(user_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }
}