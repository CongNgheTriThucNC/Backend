import { createModuleFactory } from '../system/factories/index';
import { createAuthModule } from './auth';
import { createLocationModule } from './location/location.controller';
import { createUserModule } from './user/user.controller';

export const createRootModule = createModuleFactory({
    path: '/api',
    name: 'Root',
    bundler: router => {
        createAuthModule(router);
        createLocationModule(router);
        createUserModule(router);
    },
});
