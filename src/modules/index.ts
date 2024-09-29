import { createModuleFactory } from '../system/factories/index';
import { createAuthModule } from './auth';

export const createRootModule = createModuleFactory({
    path: '/api',
    name: 'Root',
    bundler: router => {
        createAuthModule(router);
    },
});
