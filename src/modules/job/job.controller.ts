import { swaggerBuilder } from '../../system/swagger';
import { PropertyFactory } from '../../system/swagger/core/property.factory';
import { createModuleFactory } from '../../system/factories/module.factory';
import { createHandler } from '../../system/factories';
import { HttpResponseBuilder } from '../../system/builders/http-response.builder';
import {
    createJobDtoValidator,
    updateJobDtoValidator,
    jobService,
} from './service';

const MODULE_NAME = 'Job';

export const createJobModule = createModuleFactory({
    path: '/jobs',
    name: MODULE_NAME,
    bundler: router => {
        swaggerBuilder.addTag(MODULE_NAME);

        // Define Job DTO model
        const JOB_DTO_NAME = 'JobDto';
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
                jobTypeId: PropertyFactory.createProperty({
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

        // Define GET /jobs route (get all jobs)
        swaggerBuilder.addRoute({
            route: '/jobs',
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
                const jobFilter = {
                    Industry: req.query.Industry,
                    JobType: req.query.JobType,
                    Location: req.query.Location,
                    Experience: req.query.Experience,
                    Salary: req.query.Salary,
                    Education: req.query.Education,
                    CareerLevel: req.query.CareerLevel,
                    Query: req.query.Query,
                    page: Number(req.query.page),
                    limit: Number(req.query.limit),
                };
                const jobs = await jobService.getAllJobs(jobFilter);
                return HttpResponseBuilder.buildOK(res, jobs);
            }),
        );

        // Define GET /jobs/:id route (get job by ID)
        swaggerBuilder.addRoute({
            route: '/jobs/{id}',
            tags: [MODULE_NAME],
            method: 'get',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Job ID',
                    required: true,
                }),
            ],
        });
        router.get(
            '/:id',
            createHandler(async (req, res) => {
                const jobId = req.params.id;
                const job = await jobService.getJobById(jobId);
                return HttpResponseBuilder.buildOK(res, job);
            }),
        );

        // Define POST /jobs route (create a new job)
        swaggerBuilder.addRoute({
            route: '/jobs',
            body: JOB_DTO_NAME,
            tags: [MODULE_NAME],
            method: 'post',
        });
        router.post(
            '/',
            createJobDtoValidator,
            createHandler(async (req, res) => {
                const createDto = {
                    title: req.body.title,
                    description: req.body.description,
                    locationIds: req.body.locationIds,
                    employerId: req.body.employerId,
                    jobTypeId: req.body.jobTypeId,
                    salary: req.body.salary,
                    status: req.body.status,
                };

                const newJob = await jobService.createJob(createDto);
                return HttpResponseBuilder.buildCreated(res, newJob);
            }),
        );

        // Define PATCH /jobs/:id route (update job by ID)
        swaggerBuilder.addRoute({
            route: '/jobs/{id}',
            body: JOB_DTO_NAME,
            tags: [MODULE_NAME],
            method: 'patch',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Job ID',
                    required: true,
                }),
            ],
        });
        router.patch(
            '/:id',
            updateJobDtoValidator,
            createHandler(async (req, res) => {
                const jobId = req.params.id;
                const updateDto = {
                    title: req.body.title,
                    description: req.body.description,
                    locationId: req.body.locationId,
                    employerId: req.body.employerId,
                    jobTypeId: req.body.jobTypeId,
                    salary: req.body.salary,
                    status: req.body.status,
                };

                const updatedJob = await jobService.updateJob(jobId, updateDto);
                return HttpResponseBuilder.buildOK(res, updatedJob);
            }),
        );

        // Define DELETE /jobs/:id route (delete job by ID)
        swaggerBuilder.addRoute({
            route: '/jobs/{id}',
            tags: [MODULE_NAME],
            method: 'delete',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Job ID',
                    required: true,
                }),
            ],
        });
        router.delete(
            '/:id',
            createHandler(async (req, res) => {
                const jobId = req.params.id;
                await jobService.deleteJob(jobId);
                return HttpResponseBuilder.buildNoContent(res);
            }),
        );
    },
});
