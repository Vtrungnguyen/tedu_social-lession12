import { HttpException } from '@core/exceptions';
import { isEmptyObject } from '@core/utils/helpers';
import { TokenData } from '@modules/auth';
import RegisterDto from './dtos/register.dto';
import UserSchema from './users.model'
import gravatar from 'gravatar'
import bcryptjs from 'bcryptjs'
import IUser from './users.interface';
import jwt from 'jsonwebtoken';
import { DataStoredInToken } from './../auth/auth.interface';
class UserService {
    public userSchema = UserSchema;
    // create User
    public async createUser(model: RegisterDto): Promise<TokenData> {
        if (isEmptyObject(model)) {
            throw new HttpException(400, 'Model is empty !');
        }

        const user = await this.userSchema.findOne({ email: model.email }).exec();
        if (user) {
            throw new HttpException(409, `Your email ${model.email} already exit.`);
        }

        const avatar = gravatar.url(model.email!, {
            size: '200',
            rating: 'g',
            default: 'mm',
        });

        const salt = await bcryptjs.genSalt(10);

        const hashedPassword = await bcryptjs.hash(model.password!, salt);
        const createdUser: IUser = await this.userSchema.create({
            ...model,
            password: hashedPassword,
            avatar: avatar,
            date: Date.now(),
        });
        return this.createToken(createdUser);
    }
    //Update User
    public async updateUser(userId: string, model: RegisterDto): Promise<IUser> {
        if (isEmptyObject(model)) {
            throw new HttpException(400, 'Model is empty !');
        }

        const user = await this.userSchema.findById(userId).exec();
        if (!user) {
            throw new HttpException(400, `User ${userId} is not exist`);
        }

        if (user.email === model.email)
            throw new HttpException(400, `You must using the difference email`);

        let updateUserById;
        if (model.password) {
            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(model.password, salt);
            updateUserById = await this.userSchema.findByIdAndUpdate(userId, {
                ...model,
                password: hashedPassword,
            }).exec();
        }
        else {
            updateUserById = await this.userSchema.findByIdAndUpdate(userId, {
                ...model,
            }).exec();
        }

        if (!updateUserById) throw new HttpException(409, `You are not an user`);
        return updateUserById;
    }


    public async getUserByID(userID: string): Promise<IUser> {

        const user = await this.userSchema.findById(userID).exec();
        if (!user) {
            throw new HttpException(404, `User is not exists`);
        }
        return user;
    }
    private createToken(user: IUser): TokenData {
        const dataInToken: DataStoredInToken = { id: user._id };
        const secret: string = process.env.JWT_TOKEN_SECRET!;
        const expiresIn: number = 3600;
        return {
            token: jwt.sign(dataInToken, secret, { expiresIn: expiresIn }),
        }
    }
}
export default UserService;