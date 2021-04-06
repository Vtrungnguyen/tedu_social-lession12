
import { Route } from '@core/interface';
import { validationMiddleware } from '@core/middleware';
import { Router } from 'express';
import RegisterDto from './dtos/register.dto';
import UsersController from './users.controller';

export default class UsersRoute implements Route {
    public path = '/api/users';
    public router = Router();

    public usersController = new UsersController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path, validationMiddleware(RegisterDto, true), this.usersController.register); //POST: http://localhost:5000/api/users
        this.router.put(this.path + '/:id', validationMiddleware(RegisterDto, true), this.usersController.updateUser);// //Put: http://localhost:5000/api/users
        this.router.get(this.path + '/:id', this.usersController.getUserById);
    }
}