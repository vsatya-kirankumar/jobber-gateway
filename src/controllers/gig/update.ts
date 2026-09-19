import { Request, Response } from 'express';
import { gigService } from 'src/services/api/gig.service';
import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';

export class GigUpdate {
  public async gig(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await gigService.updateGig(`${req.params.gigId}`, req.body);
    res.status(StatusCodes.OK).json({ message: response.data.message, gig: response.data.gig });
  }

  public async gigActive(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await gigService.updateActiveGigProp(`${req.params.gigId}`, req.body.active);
    res.status(StatusCodes.OK).json({ message: response.data.message, gig: response.data.gig });
  }
}
