import { TokenData } from "@modules/auth";
import { NextFunction, Request, Response } from "express";
import AuthorService from "./auth.service";
import RegisterDto from "./dtos/register.dto";
import UserService from "./users.service";

export default class AuthorController {
    private authService = new AuthorService();
    public Login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const model: RegisterDto = req.body;
            const tokenData: TokenData = await this.authService.login(model);
            res.status(200).json(tokenData);
        } catch (error) {
            next(error);
        }
    };
}