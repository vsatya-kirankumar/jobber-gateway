import { authService } from '@gateway/services/api/auth.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class Signin {
  public async read(req: Request, res: Response): Promise<void> {
    try {
      const response: AxiosResponse = await authService.signIn(req.body);
      const { message, user, token, browserName, deviceType } = response.data;
      req.session = { jwt: token };
      res.status(StatusCodes.OK).json({ message, user, browserName, deviceType });
    } catch (error: any) {
      const statusCode = error.response?.status || error.response?.data?.error?.statusCode || 500;

      const response = error.response?.data || {
        message: 'Authentication service error'
      };

      res.status(statusCode).json(response);
    }
  }
}
