import { swaggerBuilder } from '../../system/swagger';
import { PropertyFactory } from '../../system/swagger/core/property.factory';
import { createModuleFactory } from '../../system/factories/module.factory';
import { createHandler } from '../../system/factories';
import { HttpResponseBuilder } from '../../system/builders/http-response.builder';
import {
    createCompanyDtoValidator,
    updateCompanyDtoValidator,
    companyService,
} from './service';

const MODULE_NAME = 'Company';

export const createCompanyModule = createModuleFactory({
    path: '/companies',
    name: MODULE_NAME,
    bundler: router => {
        swaggerBuilder.addTag(MODULE_NAME);

        // Define Company DTO model
        const JOB_DTO_NAME = 'CompanyDto';
        swaggerBuilder.addModel({
            name: JOB_DTO_NAME,
            properties: {
                title: PropertyFactory.createProperty({ type: 'string' }),
                description: PropertyFactory.createProperty({ type: 'string' }),
                locationIds: PropertyFactory.createProperty({
                    type: 'array',
                    model: 'ObjectId',
                }),
                employerId: PropertyFactory.createProperty({
                    type: 'string',
                    format: 'ObjectId',
                }),
                companyTypeId: PropertyFactory.createProperty({
                    type: 'string',
                    format: 'ObjectId',
                }),
                salary: PropertyFactory.createProperty({ type: 'number' }),
                status: PropertyFactory.createProperty({
                    type: 'string',
                    enum: ['Active', 'Closed'],
                }),
            },
        });

        // Define GET /companies route (get all companys)
        swaggerBuilder.addRoute({
            route: '/companies',
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
                const companyFilter = {
                    CompanyAddress: req.query.CompanyAddress,
                    CompanySize: req.query.CompanySize,
                    page: Number(req.query.page),
                    limit: Number(req.query.limit),
                };
                const companies =
                    await companyService.getAllCompanies(companyFilter);
                return HttpResponseBuilder.buildOK(res, companies);
            }),
        );

        // Define GET /companies/:id route (get company by ID)
        swaggerBuilder.addRoute({
            route: '/companies/{id}',
            tags: [MODULE_NAME],
            method: 'get',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Company ID',
                    required: true,
                }),
            ],
        });
        router.get(
            '/:id',
            createHandler(async (req, res) => {
                const companyId = req.params.id;
                const company = await companyService.getCompanyById(companyId);
                return HttpResponseBuilder.buildOK(res, company);
            }),
        );

        // Define GET /companies/:id/jobs route (get jobs companyID)
        swaggerBuilder.addRoute({
            route: '/companies/{id}/jobs',
            tags: [MODULE_NAME],
            method: 'get',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Company ID',
                    required: true,
                }),
            ],
        });
        router.get(
            '/:id/jobs',
            createHandler(async (req, res) => {
                const jobsByCompanyIdFilter = {
                    CompanyId: req.params.id,
                    page: Number(req.query.page),
                    limit: Number(req.query.limit),
                };
                const jobs = await companyService.getJobsByCompanyId(
                    jobsByCompanyIdFilter,
                );
                return HttpResponseBuilder.buildOK(res, jobs);
            }),
        );

        // Define POST /companys route (create a new company)
        swaggerBuilder.addRoute({
            route: '/companies',
            body: JOB_DTO_NAME,
            tags: [MODULE_NAME],
            method: 'post',
        });
        router.post(
            '/',
            // createCompanyDtoValidator,
            // createHandler(async (req, res) => {
            //     const createDto = {
            //         title: req.body.title,
            //         description: req.body.description,
            //         locationIds: req.body.locationIds,
            //         employerId: req.body.employerId,
            //         companyTypeId: req.body.companyTypeId,
            //         salary: req.body.salary,
            //         status: req.body.status,
            //     };

            //     const newCompany = await companyService.createCompany(createDto);
            //     return HttpResponseBuilder.buildCreated(res, newCompany);
            // }),
        );

        // Define PATCH /companies/:id route (update company by ID)
        swaggerBuilder.addRoute({
            route: '/companies/{id}',
            body: JOB_DTO_NAME,
            tags: [MODULE_NAME],
            method: 'patch',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Company ID',
                    required: true,
                }),
            ],
        });
        router.patch(
            '/:id',
            updateCompanyDtoValidator,
            createHandler(async (req, res) => {
                const companyId = req.params.id;
                const updateDto = {
                    title: req.body.title,
                    description: req.body.description,
                    locationId: req.body.locationId,
                    employerId: req.body.employerId,
                    companyTypeId: req.body.companyTypeId,
                    salary: req.body.salary,
                    status: req.body.status,
                };

                const updatedCompany = await companyService.updateCompany(
                    companyId,
                    updateDto,
                );
                return HttpResponseBuilder.buildOK(res, updatedCompany);
            }),
        );

        // Define DELETE /companies/:id route (delete company by ID)
        swaggerBuilder.addRoute({
            route: '/companies/{id}',
            tags: [MODULE_NAME],
            method: 'delete',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Company ID',
                    required: true,
                }),
            ],
        });
        router.delete(
            '/:id',
            createHandler(async (req, res) => {
                const companyId = req.params.id;
                await companyService.deleteCompany(companyId);
                return HttpResponseBuilder.buildNoContent(res);
            }),
        );
    },
});
