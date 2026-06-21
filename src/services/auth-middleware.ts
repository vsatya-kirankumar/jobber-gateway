import { config } from '@gateway/config';
import { BadRequestError, IAuthPayload, NotAuthorizedError } from '@vsatya-kirankumar/jobber-shared';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

export class AuthMiddleware {
  public verifyUser(req: Request, _res: Response, next: NextFunction): void {
    if (!req.session?.jwt) {
      throw new NotAuthorizedError('Unauthorized: No token provided. Please login again.', 'GatewayService verifyUser() method error.');
    }

    try {
      const payload: IAuthPayload = verify(req.session.jwt, `${config.JWT_TOKEN}`) as IAuthPayload;
      req.currentUser = payload;
    } catch (error) {
      throw new NotAuthorizedError('Token is not available. Please login again.', 'GatewayService verifyUser() method error.');
    }
    next();
  }

  public checkAuthentication(req: Request, _res: Response, next: NextFunction) {
    if (!req.currentUser) {
      throw new BadRequestError('Authorization is required to access the route.', 'Gateway service checkAuthentication() method error.');
    }
    next();
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
