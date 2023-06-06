import { Router, Request, Response } from 'express';
import {
  XSRF_PROTECTED_2
} from '../guards/xsrf.guard';
import { UtilsRequestHandler } from '../handlers/utils.handler';
import { HttpStatusCode } from 'src/enums/http-codes.enum';

export const UtilsRouter: Router = Router({ mergeParams: true });

UtilsRouter.get('/get-csrf-token', (request: Request, response: Response) => {
  return response.status(HttpStatusCode.OK).json({ message: `Admit One` });
});

UtilsRouter.get('/get-xsrf-token', UtilsRequestHandler.get_xsrf_token);
UtilsRouter.get('/get-xsrf-token-pair', UtilsRequestHandler.get_xsrf_token_pair);

UtilsRouter.post('/get-google-api-key', UtilsRequestHandler.get_google_maps_key);
UtilsRouter.post('/get-stripe-public-key', UtilsRequestHandler.get_stripe_public_key);

UtilsRouter.put('/get-google-api-key', UtilsRequestHandler.get_google_maps_key);
UtilsRouter.put('/get-stripe-public-key', UtilsRequestHandler.get_stripe_public_key);
UtilsRouter.put('/get-location-via-coordinates/:lat/:lng', UtilsRequestHandler.get_location_via_coordinates);
// UtilsRouter.put('/get-location-via-coordinates-google/:lat/:lng', UtilsRequestHandler.get_location_via_coordinates_google);