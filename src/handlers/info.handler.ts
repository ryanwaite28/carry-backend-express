import { Request, Response } from 'express';
import { CatchRequestHandlerError } from '../decorators/service-method-error-handler.decorator';
import { ExpressResponse, ServiceMethodResults } from '../interfaces/common.interface';
import { InfoService } from '../services/info.service';


export class InfoRequestHandler {
  @CatchRequestHandlerError()
  static async get_site_info(request: Request, response: Response): ExpressResponse {
    const serviceMethodResults: ServiceMethodResults = await InfoService.get_site_info();
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  /** External API calls */

  @CatchRequestHandlerError()
  static async get_business_news(request: Request, response: Response): ExpressResponse {
    const serviceMethodResults: ServiceMethodResults = await InfoService.get_business_news();
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }
}