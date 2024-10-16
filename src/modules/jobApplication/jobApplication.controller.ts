// src/modules/job-application/jobApplicationModule.ts

import { swaggerBuilder } from '../../system/swagger';
import { PropertyFactory } from '../../system/swagger/core/property.factory';
import { createModuleFactory } from '../../system/factories/module.factory';
import { createHandler } from '../../system/factories';
import { HttpResponseBuilder } from '../../system/builders/http-response.builder';
import {
    jobApplicationService,
    updateJobApplicationDtoValidator,
    createJobApplicationDtoValidator
} from './service';

const MODULE_NAME = 'JobApplication';

export const createJobApplicationModule = createModuleFactory({
    path: '/job-applications',
    name: MODULE_NAME,
    bundler: router => {
        swaggerBuilder.addTag(MODULE_NAME);

        // Define Job Application DTO model
        const JOB_APPLICATION_DTO_NAME = 'JobApplicationDto';
        swaggerBuilder.addModel({
            name: JOB_APPLICATION_DTO_NAME,
            properties: {
                jobId: PropertyFactory.createProperty({
                    type: 'string',
                    format: 'ObjectId',
                }),
                userId: PropertyFactory.createProperty({
                    type: 'string',
                    format: 'ObjectId',
                }),
                applicationDate: PropertyFactory.createProperty({
                    type: 'string',
                    format: 'date-time',
                }),
                applicationStatus: PropertyFactory.createProperty({
                    type: 'enum',
                    model: {
                        Pending: 'Pending',
                        Reviewed: 'Reviewed',
                        Rejected: 'Rejected',
                    },
                }),
            },
        });

        // Define GET /job-applications route (get all job applications)
        swaggerBuilder.addRoute({
            route: '/job-applications',
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
            ],
        });
        router.get(
            '/',
            createHandler(async (req, res) => {
                const jobApplications = await jobApplicationService.getAllJobApplications(req.query);
                return HttpResponseBuilder.buildOK(res, jobApplications);
            }),
        );

        // Define GET /job-applications/:id route (get job application by ID)
        swaggerBuilder.addRoute({
            route: '/job-applications/{id}',
            tags: [MODULE_NAME],
            method: 'get',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Job Application ID',
                    required: true,
                }),
            ],
        });
        router.get(
            '/:id',
            createHandler(async (req, res) => {
                const applicationId = req.params.id;
                const jobApplication = await jobApplicationService.getJobApplicationById(applicationId);
                return HttpResponseBuilder.buildOK(res, jobApplication);
            }),
        );

        // Define POST /job-applications route (create a new job application)
        swaggerBuilder.addRoute({
            route: '/job-applications',
            body: JOB_APPLICATION_DTO_NAME,
            tags: [MODULE_NAME],
            method: 'post',
        });
        router.post(
            '/',
            createJobApplicationDtoValidator,
            createHandler(async (req, res) => {
                const createDto = {
                    jobId: req.body.jobId,
                    userId: req.body.userId,
                    applicationDate: req.body.applicationDate,
                    applicationStatus: req.body.applicationStatus,
                };

                const newJobApplication = await jobApplicationService.createJobApplication(createDto);
                return HttpResponseBuilder.buildCreated(res, newJobApplication);
            }),
        );

        // Define PATCH /job-applications/:id route (update job application by ID)
        swaggerBuilder.addRoute({
            route: '/job-applications/{id}',
            body: JOB_APPLICATION_DTO_NAME,
            tags: [MODULE_NAME],
            method: 'patch',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Job Application ID',
                    required: true,
                }),
            ],
        });
        router.patch(
            '/:id',
            updateJobApplicationDtoValidator,
            createHandler(async (req, res) => {
                const applicationId = req.params.id;
                const updateDto = {
                    jobId: req.body.jobId,
                    userId: req.body.userId,
                    applicationDate: req.body.applicationDate,
                    applicationStatus: req.body.applicationStatus,
                };

                const updatedJobApplication = await jobApplicationService.updateJobApplication(applicationId, updateDto);
                return HttpResponseBuilder.buildOK(res, updatedJobApplication);
            }),
        );

        // Define DELETE /job-applications/:id route (delete job application by ID)
        swaggerBuilder.addRoute({
            route: '/job-applications/{id}',
            tags: [MODULE_NAME],
            method: 'delete',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Job Application ID',
                    required: true,
                }),
            ],
        });
        router.delete(
            '/:id',
            createHandler(async (req, res) => {
                const applicationId = req.params.id;
                await jobApplicationService.deleteJobApplication(applicationId);
                return HttpResponseBuilder.buildNoContent(res);
            }),
        );
    },
});
