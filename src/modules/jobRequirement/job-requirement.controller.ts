import { swaggerBuilder } from '../../system/swagger';
import { PropertyFactory } from '../../system/swagger/core/property.factory';
import { createModuleFactory } from '../../system/factories/module.factory';
import { createHandler } from '../../system/factories';
import { HttpResponseBuilder } from '../../system/builders/http-response.builder';
import {
    createJobRequirementDtoValidator,
    updateJobRequirementDtoValidator,
    jobRequirementService,
} from './service';

const MODULE_NAME = 'JobRequirement';

export const createJobRequirementModule = createModuleFactory({
    path: '/job-requirements',
    name: MODULE_NAME,
    bundler: router => {
        swaggerBuilder.addTag(MODULE_NAME);

        // Define Job Requirement DTO model
        const JOB_REQUIREMENT_DTO_NAME = 'JobRequirementDto';
        swaggerBuilder.addModel({
            name: JOB_REQUIREMENT_DTO_NAME,
            properties: {
                jobId: PropertyFactory.createProperty({
                    type: 'string',
                    format: 'ObjectId',
                }),
                requirementDescription: PropertyFactory.createProperty({
                    type: 'string',
                }),
                requirementType: PropertyFactory.createProperty({
                    type: 'enum',
                    model: {
                        Skill: 'Skill',
                        Education: 'Education',
                        Experience: '  ',
                    },
                }),
            },
        });

        // Define GET /job-requirements route (get all job requirements)
        swaggerBuilder.addRoute({
            route: '/job-requirements',
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
                const jobRequirements =
                    await jobRequirementService.getAllJobRequirements(
                        req.query,
                    );
                return HttpResponseBuilder.buildOK(res, jobRequirements);
            }),
        );

        // Define GET /job-requirements/:id route (get job requirement by ID)
        swaggerBuilder.addRoute({
            route: '/job-requirements/{id}',
            tags: [MODULE_NAME],
            method: 'get',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Job Requirement ID',
                    required: true,
                }),
            ],
        });
        router.get(
            '/:id',
            createHandler(async (req, res) => {
                const jobRequirementId = req.params.id;
                const jobRequirement =
                    await jobRequirementService.getJobRequirementById(
                        jobRequirementId,
                    );
                return HttpResponseBuilder.buildOK(res, jobRequirement);
            }),
        );

        // Define POST /job-requirements route (create a new job requirement)
        swaggerBuilder.addRoute({
            route: '/job-requirements',
            body: JOB_REQUIREMENT_DTO_NAME,
            tags: [MODULE_NAME],
            method: 'post',
        });
        router.post(
            '/',
            createJobRequirementDtoValidator,
            createHandler(async (req, res) => {
                const createDto = {
                    jobId: req.body.jobId,
                    requirementDescription: req.body.requirementDescription,
                    requirementType: req.body.requirementType,
                };

                const newJobRequirement =
                    await jobRequirementService.createJobRequirement(createDto);
                return HttpResponseBuilder.buildCreated(res, newJobRequirement);
            }),
        );

        // Define PATCH /job-requirements/:id route (update job requirement by ID)
        swaggerBuilder.addRoute({
            route: '/job-requirements/{id}',
            body: JOB_REQUIREMENT_DTO_NAME,
            tags: [MODULE_NAME],
            method: 'patch',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Job Requirement ID',
                    required: true,
                }),
            ],
        });
        router.patch(
            '/:id',
            updateJobRequirementDtoValidator,
            createHandler(async (req, res) => {
                const jobRequirementId = req.params.id;
                const updateDto = {
                    jobId: req.body.jobId,
                    requirementDescription: req.body.requirementDescription,
                    requirementType: req.body.requirementType,
                };

                const updatedJobRequirement =
                    await jobRequirementService.updateJobRequirement(
                        jobRequirementId,
                        updateDto,
                    );
                return HttpResponseBuilder.buildOK(res, updatedJobRequirement);
            }),
        );

        // Define DELETE /job-requirements/:id route (delete job requirement by ID)
        swaggerBuilder.addRoute({
            route: '/job-requirements/{id}',
            tags: [MODULE_NAME],
            method: 'delete',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Job Requirement ID',
                    required: true,
                }),
            ],
        });
        router.delete(
            '/:id',
            createHandler(async (req, res) => {
                const jobRequirementId = req.params.id;
                await jobRequirementService.deleteJobRequirement(
                    jobRequirementId,
                );
                return HttpResponseBuilder.buildNoContent(res);
            }),
        );
    },
});
