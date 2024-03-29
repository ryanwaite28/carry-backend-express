import { Router, Request, Response, NextFunction } from 'express';
import express_device from 'express-device';
import express_fileupload from 'express-fileupload';
import * as body_parser from 'body-parser';
import * as cookie_parser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import { corsMiddleware, corsMobileMiddleware } from '../utils/constants.utils';
import { DeliveriesRouter } from './deliveries.router';
import { UsersRouter } from './users.router';
import { CommonRouter } from './common.router';
import { CsrfProtectionMiddleware } from 'src/middlewares/csrf.middleware';
import { RequestLoggerMiddleware } from 'src/middlewares/request-logger.middleware';


export const CarryRouter: Router = Router({ mergeParams: true });

CarryRouter.use(express_fileupload({ safeFileNames: true, preserveExtension: true }));
CarryRouter.use(express_device.capture());
CarryRouter.use(cookie_parser.default());
CarryRouter.use(body_parser.json());
CarryRouter.use(body_parser.urlencoded({ extended: false }));

CarryRouter.use(RequestLoggerMiddleware);



export const CarryWebRouter: Router = Router({ mergeParams: true });
export const CarryMobileRouter: Router = Router({ mergeParams: true });



CarryWebRouter.use(bodyParser.json());
CarryMobileRouter.use(bodyParser.json());

const enable_cors = (
  process.env.APP_ENV !== `LOCAL`
);

console.log({ enable_cors });

// if (enable_cors) {

  CarryWebRouter.use(corsMiddleware);

// }

CarryWebRouter.use(CsrfProtectionMiddleware);
CarryWebRouter.use('/users', UsersRouter);
CarryWebRouter.use('/deliveries', DeliveriesRouter);
CarryWebRouter.use('/common', CommonRouter);


CarryMobileRouter.use(corsMobileMiddleware);
CarryMobileRouter.use('/users', UsersRouter);
CarryMobileRouter.use('/deliveries', DeliveriesRouter);
CarryMobileRouter.use('/common', CommonRouter);



export function setWebContext(request: Request, response: Response, next: NextFunction) {
  response.locals['IS_MOBILE'] = false;
  next();
}

export function setMobileContext(request: Request, response: Response, next: NextFunction) {
  response.locals['IS_MOBILE'] = true;
  next();
}

CarryRouter.use(`/web`, setWebContext, CarryWebRouter);
CarryRouter.use(`/mobile`, setMobileContext, CarryMobileRouter);
