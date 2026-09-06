import { Router } from 'express';
import express from 'express';
import { Seller } from '@gateway/controllers/users/sellers/get';

class SellerRoutes { 
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/seller/id/:sellerId', Seller.prototype.getSellerById);
    this.router.get('/seller/username/:username', Seller.prototype.getSellerByUserName);
    this.router.post('/seller/create', Seller.prototype.createSeller);
    this.router.get('/seller/random/:size', Seller.prototype.getRandomSellers);
    this.router.put('/seller/update', Seller.prototype.updateSeller);
    this.router.get('/seller/seed/:count', Seller.prototype.getSeeds);

    return this.router;
  }
}

export const sellerRoutes: SellerRoutes = new SellerRoutes();
