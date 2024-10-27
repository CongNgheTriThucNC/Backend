// src/modules/job/job.service.ts

import { omit } from 'lodash';
import { JobNotFoundException } from './exceptions/job.exceptions';
import { JobModel, IJob } from '../../../system/model';
import { getDriver } from '../../../system/database/neo4j';
import { logger } from './../../../system/logging/logger';
import * as neo4j from 'neo4j-driver';
import { convertNeo4jInteger } from '../../../utils/convert-neo4j-integer';
interface JobFilter {
    Industry?: string;
    JobType?: string;
    Location?: string;
    Experience?: string;
    Salary?: string;
    Education?: string;
    CareerLevel?: string;
    page?: number;
    limit?: number;
}
class JobService {
    // Get a paginated list of all jobs
    async getAllJobs(filter: JobFilter) {
        const driver = getDriver();
        const session = driver.session();

        try {
            const page = filter.page || 1;
            const limit = filter.limit || 10;
            const skip = (page - 1) * limit;
            let query = `
            MATCH (j:Job)
            WHERE
              ($Industry IS NULL OR j.Industry = $Industry) AND
              ($JobType IS NULL OR j.JobType = $JobType) AND
              ($Location IS NULL OR j.JobAddress = $Location) AND
              ($Experience IS NULL OR j.YearsofExperience = $Experience) AND
              ($Salary IS NULL OR j.Salary = $Salary) AND
              ($Education IS NULL OR j.JobRequirements CONTAINS $Education) AND
              ($CareerLevel IS NULL OR j.CareerLevel = $CareerLevel)
            RETURN j
            SKIP $skip LIMIT $limit
          `;

            const result = await session.run(query, {
                Industry: filter.Industry || null,
                JobType: filter.JobType || null,
                Location: filter.Location || null,
                Experience: filter.Experience || null,
                Salary: filter.Salary || null,
                Education: filter.Education || null,
                CareerLevel: filter.CareerLevel || null,
                skip: neo4j.int(skip),
                limit: neo4j.int(limit),
            });
            const jobs = result.records.map(record => {
                const properties = record.get('j').properties;
                const submissionDeadline = properties.SubmissionDeadline
                    ? {
                          year: convertNeo4jInteger(
                              properties.SubmissionDeadline.year,
                          ),
                          month: convertNeo4jInteger(
                              properties.SubmissionDeadline.month,
                          ),
                          day: convertNeo4jInteger(
                              properties.SubmissionDeadline.day,
                          ),
                      }
                    : null;
                return {
                    ...properties,
                    SubmissionDeadline: submissionDeadline,
                    JobID: convertNeo4jInteger(properties.JobID),
                    NumberofCandidate: convertNeo4jInteger(
                        properties.NumberofCandidate,
                    ),
                };
            });

            // Query to get total count of jobs matching the filters
            const totalCountResult = await session.run(
                `
            MATCH (j:Job)
            WHERE
              ($Industry IS NULL OR j.Industry = $Industry) AND
              ($JobType IS NULL OR j.JobType = $JobType) AND
              ($Location IS NULL OR j.JobAddress = $Location) AND
              ($Experience IS NULL OR j.YearsofExperience = $Experience) AND
              ($Salary IS NULL OR j.Salary = $Salary) AND
              ($Education IS NULL OR j.JobRequirements CONTAINS $Education) AND
              ($CareerLevel IS NULL OR j.CareerLevel = $CareerLevel)
            RETURN count(j) AS totalCount
          `,
                {
                    Industry: filter.Industry || null,
                    JobType: filter.JobType || null,
                    Location: filter.Location || null,
                    Experience: filter.Experience || null,
                    Salary: filter.Salary || null,
                    Education: filter.Education || null,
                    CareerLevel: filter.CareerLevel || null,
                },
            );

            const totalDocs = totalCountResult.records[0]
                .get('totalCount')
                .toNumber();
            const totalPages = Math.ceil(totalDocs / limit);
            const hasNextPage = page < totalPages;
            const hasPrevPage = page > 1;

            return {
                docs: jobs,
                totalDocs,
                limit,
                totalPages,
                page,
                hasPrevPage,
                hasNextPage,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
            };
        } catch (error) {
            logger.error('Error fetching jobs from Neo4j:' + error);
            throw error;
        } finally {
            await session.close();
        }
    }
    // Get job details by ID
    async getJobById(jobId: string) {
        const driver = getDriver();
        const session = driver.session();

        try {
            const query = `
            MATCH (j:Job {JobID: $jobId})
            RETURN j
        `;

            const result = await session.run(query, {
                jobId: neo4j.int(jobId),
            });
            if (result.records.length === 0) {
                return null;
            }

            const job = result.records[0].get('j').properties;
            const submissionDeadline = job.SubmissionDeadline
                ? {
                      year: convertNeo4jInteger(job.SubmissionDeadline.year),
                      month: convertNeo4jInteger(job.SubmissionDeadline.month),
                      day: convertNeo4jInteger(job.SubmissionDeadline.day),
                  }
                : null;

            return {
                ...job,
                SubmissionDeadline: submissionDeadline,
                JobID: convertNeo4jInteger(job.JobID),
                NumberofCandidate: convertNeo4jInteger(job.NumberofCandidate),
            };
        } catch (error) {
            logger.error('Error fetching job by ID from Neo4j: ' + error);
            throw error;
        } finally {
            await session.close();
        }
    }

    // Create a new job
    async createJob(createDto: Partial<IJob>) {
        // const driver = getDriver();
        // const session = driver.session();
        // try {
        //     const query = `
        //     CREATE (j:Job {
        //         JobID: $JobID,
        //         Title: $Title,
        //         Industry: $Industry,
        //         JobType: $JobType,
        //         JobAddress: $JobAddress,
        //         YearsofExperience: $YearsofExperience,
        //         Salary: $Salary,
        //         JobRequirements: $JobRequirements,
        //         CareerLevel: $CareerLevel,
        //         SubmissionDeadline: $SubmissionDeadline,
        //         NumberofCandidate: $NumberofCandidate
        //     })
        //     RETURN j
        // `;
        //     const result = await session.run(query, {
        //         JobID: neo4j.int(createDto.JobID),
        //         Title: createDto.Title,
        //         Industry: createDto.Industry,
        //         JobType: createDto.JobType,
        //         JobAddress: createDto.JobAddress,
        //         YearsofExperience: createDto.YearsofExperience,
        //         Salary: createDto.Salary,
        //         JobRequirements: createDto.JobRequirements,
        //         CareerLevel: createDto.CareerLevel,
        //         SubmissionDeadline: createDto.SubmissionDeadline,
        //         NumberofCandidate: neo4j.int(createDto.NumberofCandidate || 0),
        //     });
        //     const job = result.records[0].get('j').properties;
        //     return {
        //         ...job,
        //         JobID: convertNeo4jInteger(job.JobID),
        //         NumberofCandidate: convertNeo4jInteger(job.NumberofCandidate),
        //     };
        // } catch (error) {
        //     logger.error('Error creating job in Neo4j: ' + error);
        //     throw error;
        // } finally {
        //     await session.close();
        // }
        return {};
    }

    // Update an existing job by ID
    async updateJob(jobId: string, updateDto: Partial<IJob>) {
        const driver = getDriver();
        const session = driver.session();

        try {
            const setFields = Object.keys(updateDto)
                .map(key => `j.${key} = $${key}`)
                .join(', ');

            const query = `
            MATCH (j:Job {JobID: $jobId})
            SET ${setFields}
            RETURN j
        `;

            const result = await session.run(query, {
                jobId: neo4j.int(jobId),
                ...updateDto,
            });

            const updatedJob = result.records[0].get('j').properties;
            return {
                ...updatedJob,
                JobID: convertNeo4jInteger(updatedJob.JobID),
                NumberofCandidate: convertNeo4jInteger(
                    updatedJob.NumberofCandidate,
                ),
            };
        } catch (error) {
            logger.error('Error updating job in Neo4j: ' + error);
            throw error;
        } finally {
            await session.close();
        }
    }

    // Soft delete a job by ID
    async deleteJob(jobId: string) {
        const driver = getDriver();
        const session = driver.session();

        try {
            const query = `
            MATCH (j:Job {JobID: $jobId})
            SET j.deleted = true
            RETURN j
        `;

            const result = await session.run(query, {
                jobId: neo4j.int(jobId),
            });
            return result.records.length > 0;
        } catch (error) {
            logger.error('Error soft deleting job in Neo4j: ' + error);
            throw error;
        } finally {
            await session.close();
        }
    }
}

export const jobService = new JobService();
