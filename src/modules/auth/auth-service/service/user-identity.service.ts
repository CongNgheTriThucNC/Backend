import { sign, verify } from 'jsonwebtoken';
import { configStore } from '../../../../system/config/';

class UserIdentityService {
    private JWT_SECRET: string;
    private EXPIRE_DAYS: string;

    constructor() {
        this.JWT_SECRET = configStore.get('JWT_SECRET');
        this.EXPIRE_DAYS = configStore.get('EXPIRE_DAYS', '1d');
    }

    async sign(userId) {
        return {
            accessToken: await sign({ userId }, this.JWT_SECRET, {
                expiresIn: this.EXPIRE_DAYS,
            }),
        };
    }

    verifyUser(token) {
        return verify(token, this.JWT_SECRET);
    }

    assignUserToRequestContext(user, request) {
        request.user = user;
    }

    getUserIdContext(request) {
        return request.user?.userId;
    }
}

export const userIdentityService = new UserIdentityService();
