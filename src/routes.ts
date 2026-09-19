import { Application } from 'express';
import { authRoutes } from '@gateway/routes/auth.routes';
import { currentUserRoutes } from '@gateway/routes/current-user.routes';
import { healthRoutes } from '@gateway/routes/health.routes';
import { authMiddleware } from '@gateway/services/auth-middleware';
import { searchRoutes } from '@gateway/routes/search.routes';
import { buyerRoutes } from '@gateway/routes/buyer.routes';
import { sellerRoutes } from '@gateway/routes/seller.routes';
import { gigRoutes } from './routes/gig.routes';

const BASE_PATH = '/api/gateway/v1';

export const appRoutes = (app: Application): void => {
  app.use('', healthRoutes.routes());

  app.use(BASE_PATH, searchRoutes.routes());
  app.use(BASE_PATH, authRoutes.routes());

  app.use(BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.routes());
  app.use(BASE_PATH, authMiddleware.verifyUser, buyerRoutes.routes());
  app.use(BASE_PATH, authMiddleware.verifyUser, sellerRoutes.routes());
  app.use(BASE_PATH, authMiddleware.verifyUser, gigRoutes.routes());
};
