// src/modules/job/job.service.ts

import { omit } from 'lodash';
import { JobNotFoundException } from './exceptions/job.exceptions'; 
import { JobModel, IJob } from '../../../system/model';

class JobService {
    // Get a paginated list of all jobs
    async getAllJobs(query: any) {
        let filter: any = {};
        if (query.search) {
            filter.$text = { $search: query.search };
        }

        const options = {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: query.sort || {},
        };

        const result = await JobModel.paginate(filter, options);
        return result;
    }

    // Get job details by ID
    async getJobById(jobId: string) {
        const job = await JobModel.findById(jobId).lean();
        if (!job) {
            throw new JobNotFoundException();
        }
        return job;
    }

    // Create a new job
    async createJob(createDto: Partial<IJob>) {
        const job = new JobModel(createDto);
        return await job.save();
    }

    // Update an existing job by ID
    async updateJob(jobId: string, updateDto: Partial<IJob>) {
        const updatedJob = await JobModel.findByIdAndUpdate(
            jobId,
            { $set: updateDto },
            { new: true, runValidators: true }
        ).lean();

        if (!updatedJob) {
            throw new JobNotFoundException();
        }

        return updatedJob;
    }

    // Soft delete a job by ID
    async deleteJob(jobId: string) {
        const deletedJob = await JobModel.deleteById(jobId);
        if (!deletedJob) {
            throw new JobNotFoundException();
        }
        return;
    }
}

export const jobService = new JobService();
