import { Router } from 'express';
import express from 'express';
import { createGig } from '@gateway/controllers/gig/create';
import { Delete } from '@gateway/controllers/gig/delete';
import { authMiddleware } from '@gateway/services/auth-middleware';
import { GigSeed } from '@gateway/controllers/gig/seed';
import { GigUpdate } from '@gateway/controllers/gig/update';
import { GigSearch } from '@gateway/controllers/gig/search';
import { Get } from '@gateway/controllers/gig/get';

class GigRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/gig/:gigId', authMiddleware.checkAuthentication, Get.prototype.gigById);
    this.router.get('/gig/category/:username', authMiddleware.checkAuthentication, Get.prototype.getGigsByCategory);
    this.router.get('/gig/seller/:sellerId', authMiddleware.checkAuthentication, Get.prototype.getSellerGigs);
    this.router.get('/gig/seller/pause/:sellerId', authMiddleware.checkAuthentication, Get.prototype.getSellerPauedGigs);
    this.router.get('/gig/top/:username', authMiddleware.checkAuthentication, Get.prototype.getTopRatedGigsByCategory);
    this.router.get('/gig/similar/:gigId', authMiddleware.checkAuthentication, Get.prototype.getMoreGigsLikeThis);

    this.router.post('/gig/create', authMiddleware.checkAuthentication, createGig.gig);
    this.router.delete('/gig/:gigId/:sellerId', authMiddleware.checkAuthentication, Delete.prototype.gig);
    this.router.put('/gig/seed/:count', authMiddleware.checkAuthentication, GigSeed.prototype.gig);
    this.router.put('/gig/:gigId', authMiddleware.checkAuthentication, GigUpdate.prototype.gig);
    this.router.purge('/gig/active/:gigId', authMiddleware.checkAuthentication, GigUpdate.prototype.gigActive);
    this.router.get('/gig/search/:from/:size/:type', authMiddleware.checkAuthentication, GigSearch.prototype.gigs);

    return this.router;
  }
}

export const gigRoutes: GigRoutes = new GigRoutes();
