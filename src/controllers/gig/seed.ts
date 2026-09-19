import { Request, Response } from 'express';
import { gigService } from '@gateway/services/api/gig.service';
import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';

export class GigSeed {
  public async gig(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await gigService.seed(req.params.count as string);
    res.status(StatusCodes.OK).json({ message: response.data.message });
  }
}
