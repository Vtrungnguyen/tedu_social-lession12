import { HttpException } from '@core/exceptions';
import { isEmptyObject } from '@core/utils/helpers';
import { DataStoreInToken, TokenData } from '@modules/auth';
import RegisterDto from './dtos/register.dto';
import UserSchema from './users.model'
import gravatar from 'gravatar'
import bcryptjs from 'bcryptjs'
import IUser from './users.interface';
import jwt from 'jsonwebtoken';
import { DataStoredInToken } from './../auth/auth.interface';
import LoginDto from './auth.dto';
import IUser from '@modules/users/users.interface';
class AuthorService {
    public userSchema = UserSchema;

    public async login(model: LoginDto): Promise<TokenData> {
        if (isEmptyObject(model)) {
            throw new HttpException(400, 'Model is empty !');
        }

        const user: IUser = await this.userSchema.findOne({ email: model.email });
        if (!user) {
            throw new HttpException(409, `Your email ${model.email} is not exit.`);// tim khong co thi bao ko ton tai
        }
        const isMatchPassword = bcryptjs.compare(model.password,user.password);
        if(!isMatchPassword) throw new HttpException(400,'Credetials is not valid');

        return this.createToken(user);
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
export default AuthorService;

//cai bcryptjs la 1 thu vien ma hoa