import { Request, Response } from 'express';
import { authService } from '@gateway/services/api/auth.service';
import { StatusCodes } from 'http-status-codes';
import { AxiosResponse } from 'axios';

export class Signin {
  public async read(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.signIn(req.body);
    req.session = { jwt: response.data.token };

    res.status(StatusCodes.OK).json({ message: response.data.message, user: response.data.user });
  }
}
