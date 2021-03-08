import { Logger } from './core/utils';
import { Route } from './core/interface';
import express, { Router } from 'express'
import mongoose from 'mongoose'
import hpp from 'hpp';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';

class App{
    public app: express.Application;
    public port: string | number;
    public production: boolean;
     constructor(routes: Route[]){
         this.app = express();
         this.port = process.env.PORT || 5000;
        this.production = process.env.NODE_ENV == 'production' ? true   :   false;

         this.initialzeRoutes(routes);
         this.connectToDatabase();
         this.initializeMiddleware();
     }

     private initialzeRoutes(routes: Route[]){
         routes.forEach((route)=>{
            this.app.use('/', route.router);
         });
     }
     private initializeMiddleware(){
         if(this.production){
             this.app.use(hpp());
             this.app.use(helmet());
             this.app.use(morgan("combined"));
             this.app.use(cors({origin: 'your.domain.com', credentials: true}));
         } else{
            this.app.use(morgan("dev"));
            this.app.use(cors({origin: 'your.domain.com', credentials: true}));
         }
     }

    public listen(){
        this.app.listen(this.port,()=>{
            Logger.info(`Server is listening on port ${this.port}`);
        });
    }
    private connectToDatabase() {
       
            const connectString = process.env.MONGODB_URI;
            if(!connectString){
                Logger.error('ConnectionString is invalid');
                return;
            }
            mongoose.connect(connectString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        }).catch((reason)=>{
            Logger.error(reason);
        });
        Logger.info('Database connected...');
     
    }
}

export default App;