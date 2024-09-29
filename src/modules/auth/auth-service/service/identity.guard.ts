import { HttpResponseBuilder } from '../../../../system/builders/http-response.builder';
import { userIdentityService } from './index';

const BEARER_PREFIX = 'Bearer ';

export async function identityGuard(req, res, next) {
    const { authorization } = req.headers;

    if (!authorization) {
        return HttpResponseBuilder.buildUnAuthorized(
            res,
            'Missing authorization header',
        );
    }

    const token = authorization.substring(BEARER_PREFIX.length);

    try {
        const userCredentials = await userIdentityService.verifyUser(token);
        userIdentityService.assignUserToRequestContext(userCredentials, req);

        return next();
    } catch (e) {
        return HttpResponseBuilder.buildUnAuthorized(
            res,
            'Invalid access token',
        );
    }
}
