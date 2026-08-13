import { Request, Response } from 'express';
import { authService } from '@gateway/services/api/auth.service';
import { StatusCodes } from 'http-status-codes';
import { AxiosResponse } from 'axios';

export class CurrentUser {
  public async read(_req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.getCurrentUser();
    res.status(StatusCodes.OK).json({ message: response.data.message, user: response.data.user });
  }

  public async resendEmail(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.resendEmail(req.body);
    res.status(StatusCodes.OK).json({ message: response.data.message, user: response.data.user });
  };
}
