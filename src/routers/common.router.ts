import { Router } from 'express';
import * as bodyParser from 'body-parser';
import { InfoRouter } from './info.router';
import { UtilsRouter } from './utils.router';

// Router
export const CommonRouter: Router = Router({ mergeParams: true });
CommonRouter.use(bodyParser.json());

CommonRouter.use('/info', InfoRouter);
CommonRouter.use('/utils', UtilsRouter);

CommonRouter.use('/mobile/info', InfoRouter);
CommonRouter.use('/mobile/utils', UtilsRouter);

// CommonRouter.use('/payments', PaymentsRouter);