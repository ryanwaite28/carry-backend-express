import { Router } from 'express';
import { InfoRequestHandler } from '../handlers/info.handler';

export const InfoRouter: Router = Router({ mergeParams: true });

InfoRouter.get('/site-info', InfoRequestHandler.get_site_info);
InfoRouter.get('/app-news', InfoRequestHandler.get_business_news);