import { createModuleFactory } from '../system/factories/index';
import { createAuthModule } from './auth';
import { createLocationModule } from './location/location.controller';
import { createUserModule } from './user/user.controller';
import { createEmployerModule } from './employer/employer.controller';
import { createJobModule } from './job/job.controller';
import { createJobRequirementModule } from './jobRequirement/job-requirement.controller';
import { createJobApplicationModule } from './jobApplication/jobApplication.controller';
import { createCompanyModule } from './company/company.controller';
export const createRootModule = createModuleFactory({
    path: '/api',
    name: 'Root',
    bundler: router => {
        createAuthModule(router);
        createLocationModule(router);
        createUserModule(router);
        createEmployerModule(router);
        createJobModule(router);
        createJobRequirementModule(router);
        createJobApplicationModule(router);
        createCompanyModule(router);
    },
});
