// src/modules/job-application/jobApplication.service.ts

import { JobApplicationModel, IJobApplication } from '../../../system/model';
import { JobApplicationNotFoundException } from '../service/exceptions/jobApplication';
import { omit } from 'lodash';

class JobApplicationService {
    // Get all job applications with pagination and search
    async getAllJobApplications(query: any) {
        let filter: any = {};
        if (query.search) {
            filter.$text = { $search: query.search };
        }

        const options = {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: query.sort || {},
        };

        const result = await JobApplicationModel.paginate(filter, options);
        return result;
    }

    // Get a job application by ID
    async getJobApplicationById(applicationId: string) {
        const application = await JobApplicationModel.findById(applicationId).lean();
        if (!application) {
            throw new JobApplicationNotFoundException();
        }
        return application;
    }

    // Create a job application
    async createJobApplication(createDto: Partial<IJobApplication>) {
        const application = new JobApplicationModel(createDto);
        return await application.save();
    }

    // Update a job application by ID
    async updateJobApplication(applicationId: string, updateDto: Partial<IJobApplication>) {
        const updatedApplication = await JobApplicationModel.findByIdAndUpdate(
            applicationId,
            { $set: updateDto },
            { new: true, runValidators: true }
        ).lean();

        if (!updatedApplication) {
            throw new JobApplicationNotFoundException();
        }

        return updatedApplication;
    }

    // Soft delete a job application by ID
    async deleteJobApplication(applicationId: string) {
        const deletedApplication = await JobApplicationModel.deleteById(applicationId);
        if (!deletedApplication) {
            throw new JobApplicationNotFoundException();
        }
        return;
    }
}

export const jobApplicationService = new JobApplicationService();
