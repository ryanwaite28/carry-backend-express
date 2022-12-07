import { Router } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import { corsMiddleware } from 'src/utils/constants.utils';
import { DeliveriesRouter } from './deliveries.router';
import { UsersRouter } from './users.router';


export const CarryRouter: Router = Router({ mergeParams: true });

export const CarryWebRouter: Router = Router({ mergeParams: true });
export const CarryMobileRouter: Router = Router({ mergeParams: true });



CarryWebRouter.use(bodyParser.json());
CarryMobileRouter.use(bodyParser.json());

CarryWebRouter.options(`*`, corsMiddleware); 
// CarryMobileRouter.options(`*`, corsMiddleware); 

/** Mount Routers */

CarryWebRouter.use('/users', corsMiddleware, UsersRouter);
CarryWebRouter.use('/deliveries', corsMiddleware, DeliveriesRouter);
// CarryWebRouter.use('/admin', corsMiddleware, DeliveriesRouter);

// CarryWebRouter.use('/api', ApiKeyAuthorized, DelivermeApiRouter);


CarryMobileRouter.use(cors());
CarryMobileRouter.use('/users', UsersRouter);
CarryMobileRouter.use('/deliveries', DeliveriesRouter);



CarryRouter.use(`/`, CarryWebRouter);
CarryRouter.use(`/mobile`, CarryMobileRouter);