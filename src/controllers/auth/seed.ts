import { Request, Response } from 'express';
import { authService } from '@gateway/services/api/auth.service';
import { StatusCodes } from 'http-status-codes';
import { AxiosResponse } from 'axios';

export class AuthSeed {
  public async create(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.seed(req.params.count.toString());

    res.status(StatusCodes.OK).json({ message: response.data.message });
  }
}
