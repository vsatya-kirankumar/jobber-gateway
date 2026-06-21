import { Application } from 'express';
import { healthRoutes } from '@gateway/routes/health';

export const appRoutes = (app: Application): void => {
  //app.use('/api/v1/auth/signup', require('./routes/health').healthRoutes.routes());
  app.use('', healthRoutes.routes());
};
