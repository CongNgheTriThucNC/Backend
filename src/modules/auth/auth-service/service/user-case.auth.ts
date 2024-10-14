import { omit } from 'lodash';
import {
    IncorrectLoginException,
    EmailUserExistedException,
} from '../exceptions';
import { hashService, userIdentityService } from '.';
import { UserModel } from '../../../../system/model/index';

class AuthenticationService {
    private readonly userIdentityService = userIdentityService;
    private readonly hashService = hashService;
    constructor() {
        this.userIdentityService = userIdentityService;
        this.hashService = hashService;
    }

    async login(loginDto) {
        const { email, password } = loginDto;

        const user = await UserModel.findOne({ email }).lean();

        if (
            !user ||
            !(await this.hashService.compare({
                raw: password,
                hashed: user.password,
            }))
        ) {
            throw new IncorrectLoginException();
        }

        return this.userIdentityService.sign(user._id);
    }

    async register({ username, email, password }) {
        const user = await UserModel.findOne({ email }).lean();

        if (user) {
            throw new EmailUserExistedException();
        }

        const hashedPassword = await this.hashService.hash(password);

        const newUser = await UserModel.create({
            username,
            email,
            password: hashedPassword,
            isActive: true,
        });

        return this.userIdentityService.sign(newUser._id);
    }

    async getMe(userId) {
        const user = await UserModel.findById(userId).lean();

        return omit(user, 'password');
    }
}

export const authenticationService = new AuthenticationService();
