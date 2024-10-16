// src/modules/job-requirement/job-requirement.service.ts

import { omit } from 'lodash';
import { JobRequirementNotFoundException } from './exceptions/job-requirement.exceptions';
import { JobRequirementModel, IJobRequirement } from '../../../system/model';

class JobRequirementService {
    // Get a paginated list of all job requirements
    async getAllJobRequirements(query: any) {
        let filter: any = {};
        if (query.search) {
            filter.$text = { $search: query.search };
        }

        const options = {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: query.sort || {},
        };

        const result = await JobRequirementModel.paginate(filter, options);
        return result;
    }

    // Get job requirement details by ID
    async getJobRequirementById(requirementId: string) {
        const requirement = await JobRequirementModel.findById(requirementId);
        if (!requirement) {
            throw new JobRequirementNotFoundException();
        }
        return requirement;
    }

    // Create a new job requirement
    async createJobRequirement(createDto: Partial<IJobRequirement>) {
        const requirement = new JobRequirementModel(createDto);
        return await requirement.save();
    }

    // Update an existing job requirement by ID
    async updateJobRequirement(
        requirementId: string,
        updateDto: Partial<IJobRequirement>,
    ) {
        const updatedRequirement = await JobRequirementModel.findByIdAndUpdate(
            requirementId,
            { $set: updateDto },
            { new: true, runValidators: true },
        ).lean();

        if (!updatedRequirement) {
            throw new JobRequirementNotFoundException();
        }

        return updatedRequirement;
    }

    // Soft delete a job requirement by ID
    async deleteJobRequirement(requirementId: string) {
        const deletedRequirement =
            await JobRequirementModel.deleteById(requirementId);
        if (!deletedRequirement) {
            throw new JobRequirementNotFoundException();
        }
        return;
    }
}

export const jobRequirementService = new JobRequirementService();
