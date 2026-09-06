import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { authService } from '@gateway/services/api/auth.service';

export class Signup {
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const response: AxiosResponse = await authService.signUp(req.body);
      req.session = { jwt: response.data.token };
      res.status(StatusCodes.CREATED).json({ message: response.data.message, user: response.data.user });
    } catch (error: any) {
      const statusCode = error.response?.status || error.response?.data?.error?.statusCode || 500;

      const response = error.response?.data || {
        message: 'Authentication service error'
      };

      res.status(statusCode).json(response);
    }
  }
}
