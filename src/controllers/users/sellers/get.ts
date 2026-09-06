import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sellerService } from '@gateway/services/api/seller.service';

export class Seller {
  public async createSeller(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await sellerService.createSeller(req.body);
    res.status(StatusCodes.CREATED).json({ message: response.data.message, seller: response.data.seller });
  }

  public async updateSeller(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await sellerService.updateSeller(req.params.sellerId as string, req.body);
    res.status(StatusCodes.OK).json({ message: response.data.message, seller: response.data.seller });
  }

  public async getSellerById(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await sellerService.getSellerById(req.params.sellerId as string);
    res.status(StatusCodes.OK).json({ message: response.data.message, seller: response.data.seller });
  }

  public async getSellerByUserName(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await sellerService.getSellerByUsername(req.params.username as string);
    res.status(StatusCodes.OK).json({ message: response.data.message, seller: response.data.seller });
  }

  public async getRandomSellers(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await sellerService.getRandomSellers(req.params.size as string);
    res.status(StatusCodes.OK).json({ message: response.data.message, sellers: response.data.sellers });
  }

  public async getSeeds(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await sellerService.seed(req.params.count as string);
    res.status(StatusCodes.OK).json({ message: response.data.message });
  }
}
