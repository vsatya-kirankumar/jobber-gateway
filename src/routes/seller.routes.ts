import { Router } from 'express';
import express from 'express';
import { Seller } from '@gateway/controllers/users/sellers/get';
import { authMiddleware } from '@gateway/services/auth-middleware';

class SellerRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/seller/id/:sellerId', authMiddleware.checkAuthentication, Seller.prototype.getSellerById);
    this.router.get('/seller/username/:username', authMiddleware.checkAuthentication, Seller.prototype.getSellerByUserName);
    this.router.post('/seller/create', authMiddleware.checkAuthentication, Seller.prototype.createSeller);
    this.router.get('/seller/random/:size', authMiddleware.checkAuthentication, Seller.prototype.getRandomSellers);
    this.router.put('/seller/update', authMiddleware.checkAuthentication, Seller.prototype.updateSeller);
    this.router.get('/seller/seed/:count', authMiddleware.checkAuthentication, Seller.prototype.getSeeds);

    return this.router;
  }
}

export const sellerRoutes: SellerRoutes = new SellerRoutes();
