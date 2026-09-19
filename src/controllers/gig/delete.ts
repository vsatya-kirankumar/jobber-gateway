import { Request, Response } from 'express';
import { gigService } from 'src/services/api/gig.service';
import { StatusCodes } from 'http-status-codes';
import { AxiosResponse } from 'axios';

export class Delete {
  public async gig(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await gigService.deleteGig(`${req.params.gigId}`, `${req.params.sellerId}`);
    res.status(StatusCodes.OK).json({ message: response.data.message });
  }
}
