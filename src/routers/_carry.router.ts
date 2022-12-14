import { Router } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import { corsMiddleware, corsMobileMiddleware } from '../utils/constants.utils';
import { DeliveriesRouter } from './deliveries.router';
import { UsersRouter } from './users.router';
import { CommonRouter } from './common.router';


export const CarryRouter: Router = Router({ mergeParams: true });



export const CarryWebRouter: Router = Router({ mergeParams: true });
export const CarryMobileRouter: Router = Router({ mergeParams: true });



CarryWebRouter.use(bodyParser.json());
CarryMobileRouter.use(bodyParser.json());

const enable_cors = (
  process.env.APP_ENV !== `LOCAL`
);

console.log({ enable_cors });

if (enable_cors) {

  CarryWebRouter.use(corsMiddleware);

}

CarryWebRouter.use('/users', UsersRouter);
CarryWebRouter.use('/deliveries', DeliveriesRouter);
CarryWebRouter.use('/common', CommonRouter);


CarryMobileRouter.use(corsMobileMiddleware);
CarryMobileRouter.use('/users', UsersRouter);
CarryMobileRouter.use('/deliveries', DeliveriesRouter);
CarryMobileRouter.use('/common', CommonRouter);

CarryRouter.use(`/web`, CarryWebRouter);
CarryRouter.use(`/mobile`, CarryMobileRouter);
