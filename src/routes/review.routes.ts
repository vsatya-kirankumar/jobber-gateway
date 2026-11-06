import { authMiddleware } from '@gateway/services/auth-middleware';
import express, { Router } from 'express';
import { Create } from 'src/controllers/review/create';
import { Get } from 'src/controllers/review/get';

class ReviewRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/review', authMiddleware.checkAuthentication, Create.prototype.review);
    this.router.get('/review/gig/:gigId', authMiddleware.checkAuthentication, Get.prototype.reviewsByGigId);
    this.router.get('/review/gig/:sellerId', authMiddleware.checkAuthentication, Get.prototype.reviewsBySellerId);

    return this.router;
  }
}

export const reviewRoutes: ReviewRoutes = new ReviewRoutes();
