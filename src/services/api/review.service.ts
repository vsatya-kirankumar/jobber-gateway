import { config } from '@gateway/config';
import { AxiosService } from '@gateway/services/axios';
import { IReviewDocument } from '@vsatya-kirankumar/jobber-shared';
import axios, { AxiosResponse } from 'axios';

export let axiosReviewInstance: ReturnType<typeof axios.create>;

class ReviewService {
  constructor() {
    const axiosService = new AxiosService(`${config.REVIEW_BASE_URL}/api/v1/review`, 'review');
    axiosReviewInstance = axiosService.axios;
  }

  async getReviewsByGigId(gigId: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosReviewInstance.get(`/gig/${gigId}`);
    return response;
  }

  async getReviewsBySellerId(sellerId: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosReviewInstance.get(`/seller/${sellerId}`);
    return response;
  }

  async addReview(body: IReviewDocument): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosReviewInstance.post('/', body);
    return response;
  }
}

export const reviewService: ReviewService = new ReviewService();
