import express, { Router } from 'express';
import { Search } from '@gateway/controllers';

class SearchRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/auth/search/gig/:from/:size/:type', Search.prototype.getGigs);
    this.router.get('/auth/search/gig/:gigId', Search.prototype.gigById);

    return this.router;
  }
}

export const searchRoutes: SearchRoutes = new SearchRoutes();
