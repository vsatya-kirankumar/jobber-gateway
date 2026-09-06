import { config } from '@gateway/config';
import { CustomError, IErrorResponse, winstonLogger } from '@vsatya-kirankumar/jobber-shared';
import compression from 'compression';
import cookieSession from 'cookie-session';
import cors from 'cors';
import { Application, json, NextFunction, Request, Response, urlencoded } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import http from 'http';
import { StatusCodes } from 'http-status-codes';
import { Logger } from 'winston';
import { elasticSearch } from '@gateway/elasticsearch';
import { appRoutes } from '@gateway/routes';
import { axiosAuthInstance } from '@gateway/services/api/auth.service';
import { axiosBuyerInstance } from '@gateway/services/api/buyer.service';
import { axiosSellerInstance } from '@gateway/services/api/seller.service';

const SERVER_PORT = process.env.PORT || 4000;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'apiGatewayServer', 'debug');

export class GatewayServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.startElasticSearch();
    this.errorHandlingMiddleware(this.app);
    this.startServer(this.app);
  }

  public securityMiddleware(app: Application): void {
    app.set('trust proxy', 1); // first trust proxy

    app.use(
      cors({
        origin: config.CLIENT_URL, // allow requests from this origin
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // allow these HTTP methods
        credentials: true // allow cookies to be sent with requests
      })
    );

    app.use(
      cookieSession({
        name: 'session',
        keys: [`${config.SECRET_KEY_ONE}`, `${config.SECRET_KEY_TWO}`],
        maxAge: 24 * 7 * 60 * 60 * 1000, // 7 days
        secure: process.env.NODE_ENV === 'production', // set secure flag in production
        httpOnly: true, // prevent client-side JavaScript from accessing the cookie
        sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax' // protect against CSRF attacks
      })
    );
    app.use(hpp());
    app.use(helmet());

    app.use((req: Request, _res: Response, next: NextFunction) => {
      if (req.session?.jwt) {
        axiosAuthInstance.defaults.headers['Authorization'] = `Bearer ${req.session?.jwt}`;
        axiosBuyerInstance.defaults.headers['Authorization'] = `Bearer ${req.session?.jwt}`;
        axiosSellerInstance.defaults.headers['Authorization'] = `Bearer ${req.session?.jwt}`;
      }
      next();
    });
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '200mb' }));
    app.use(urlencoded({ extended: true, limit: '200mb' }));
  }

  private routesMiddleware(app: Application): void {
    appRoutes(app);
  }

  private startElasticSearch(): void {
    elasticSearch.checkElasticSearchConnection();
  }

  private errorHandlingMiddleware(app: Application): void {
    app.use((req: Request, res: Response, _next: NextFunction) => {
      const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      log.log('error', `Route not found: ${fullUrl}`);
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Route not found' });
      //next();
    });

    app.use((error: IErrorResponse, _req: Request, res: Response, _next: NextFunction) => {
      log.log('error', `Gateway Service Error: ${error.comingFrom}: `, error);
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.serializeErrors());
      }
      //next();
    });
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer = new http.Server(app);
      await this.startHttpServer(httpServer);
    } catch (error) {
      log.log('error', 'Gateway startServer() Error: ', error);
    }
  }

  private async startHttpServer(httpServer: http.Server): Promise<void> {
    try {
      log.info(`Gateway server has started with process id ${process.pid}...`);
      httpServer.listen(SERVER_PORT, () => {
        log.info(`Gateway HTTP server is running on port ${SERVER_PORT}`);
      });
    } catch (error) {
      log.log('error', 'Gateway startHttpServer() Error: ', error);
    }
  }
}
