import { swaggerBuilder } from '../../system/swagger';
import { PropertyFactory } from '../../system/swagger/core/property.factory';
import { createModuleFactory } from '../../system/factories/module.factory';
import { createHandler } from '../../system/factories';
import { HttpResponseBuilder } from '../../system/builders/http-response.builder';
import {
    createEmployerDtoValidator,
    updateEmployerDtoValidator,
    employerService,
} from './service';

const MODULE_NAME = 'Employer';
export const createEmployerModule = createModuleFactory({
    path: '/employers',
    name: MODULE_NAME,
    bundler: router => {
        swaggerBuilder.addTag(MODULE_NAME);

        // Define Employer DTO model
        const EMPLOYER_DTO_NAME = 'EmployerDto';
        swaggerBuilder.addModel({
            name: EMPLOYER_DTO_NAME,
            properties: {
                name: PropertyFactory.createProperty({ type: 'string' }),
                company: PropertyFactory.createProperty({ type: 'string' }),
                email: PropertyFactory.createProperty({ type: 'string' }),
                website: PropertyFactory.createProperty({ type: 'string' }),
                contactInfo: PropertyFactory.createProperty({ type: 'string' }),
            },
        });

        // Define GET /employers route (get all employers)
        swaggerBuilder.addRoute({
            route: '/employers',
            tags: [MODULE_NAME],
            method: 'get',
            params: [
                PropertyFactory.createParam({
                    name: 'limit',
                    paramsIn: 'query',
                    type: 'number?',
                    description: 'Number of items per page (limit)',
                    required: false,
                }),
                PropertyFactory.createParam({
                    name: 'page',
                    paramsIn: 'query',
                    type: 'number?',
                    description: 'Page number',
                    required: false,
                }),
                PropertyFactory.createParam({
                    name: 'search',
                    paramsIn: 'query',
                    type: 'string?',
                    description: 'Search query',
                    required: false,
                }),
                PropertyFactory.createParam({
                    name: 'sort',
                    paramsIn: 'query',
                    type: 'string?',
                    description: 'Sort query',
                    required: false,
                }),
            ],
        });
        router.get(
            '/',
            createHandler(async (req, res) => {
                const employers = await employerService.getAllEmployers(
                    req.query,
                );
                return HttpResponseBuilder.buildOK(res, employers);
            }),
        );

        // Define GET /employers/:id route (get employer by ID)
        swaggerBuilder.addRoute({
            route: '/employers/{id}',
            tags: [MODULE_NAME],
            method: 'get',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Employer ID',
                    required: true,
                }),
            ],
        });
        router.get(
            '/:id',
            createHandler(async (req, res) => {
                const employerId = req.params.id;
                const employer =
                    await employerService.getEmployerById(employerId);
                return HttpResponseBuilder.buildOK(res, employer);
            }),
        );

        // Define POST /employers route (create a new employer)
        swaggerBuilder.addRoute({
            route: '/employers',
            body: EMPLOYER_DTO_NAME,
            tags: [MODULE_NAME],
            method: 'post',
        });
        router.post(
            '/',
            createEmployerDtoValidator,
            createHandler(async (req, res) => {
                const createDto = {
                    name: req.body.name,
                    company: req.body.company,
                    email: req.body.email,
                    website: req.body.website,
                };

                const newEmployer =
                    await employerService.createEmployer(createDto);
                return HttpResponseBuilder.buildCreated(res, newEmployer);
            }),
        );

        // Define PATCH /employers/:id route (update employer by ID)
        swaggerBuilder.addRoute({
            route: '/employers/{id}',
            body: EMPLOYER_DTO_NAME,
            tags: [MODULE_NAME],
            method: 'patch',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Employer ID',
                    required: true,
                }),
            ],
        });
        router.patch(
            '/:id',
            updateEmployerDtoValidator,
            createHandler(async (req, res) => {
                const employerId = req.params.id;
                const updateDto = {
                    name: req.body.name,
                    company: req.body.company,
                    email: req.body.email,
                    website: req.body.website,
                };

                const updatedEmployer = await employerService.updateEmployer(
                    employerId,
                    updateDto,
                );
                return HttpResponseBuilder.buildOK(res, updatedEmployer);
            }),
        );

        // Define DELETE /employers/:id route (delete employer by ID)
        swaggerBuilder.addRoute({
            route: '/employers/{id}',
            tags: [MODULE_NAME],
            method: 'delete',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Employer ID',
                    required: true,
                }),
            ],
        });
        router.delete(
            '/:id',
            createHandler(async (req, res) => {
                const employerId = req.params.id;
                await employerService.deleteEmployer(employerId);
                return HttpResponseBuilder.buildNoContent(res);
            }),
        );
    },
});
