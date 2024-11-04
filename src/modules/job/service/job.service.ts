// src/modules/job/job.service.ts

import { omit } from 'lodash';
import { JobNotFoundException } from './exceptions/job.exceptions';
import { JobModel, IJob } from '../../../system/model';
import { getNeo4jDriver } from '../../../system/database/neo4j';
import { logger } from './../../../system/logging/logger';
import {
    convertIntegerToNeo4jInteger,
    convertNeo4jIntegerToInteger,
} from '../../../utils/convert-integer-neo4j';
import { JobFilter } from '../dto/jobFilter.dto';
import { getOpenAI } from '../../../system/llm/openai.connector';
import {
    convertParamsNumber,
    convertParamsString,
} from '../../../utils/convert-content-params';
import fs from 'fs';

class JobService {
    // Get a paginated list of all jobs
    async getAllJobs(filter: JobFilter) {
        const neo4jDriver = getNeo4jDriver();
        const neo4jSession = neo4jDriver.session();
        const openaiClient = getOpenAI();
        //  read file txt to get system prompt
        const systemPrompt = fs.readFileSync(
            'src/system/llm/system-prompt.txt',
            'utf8',
        );

        try {
            const page = filter.page || 1;
            const limit = filter.limit || 10;
            const skip = (page - 1) * limit;

            let jobNameKeyword = '';
            let companyNameKeyword = '';
            let industry = '';
            let jobType = '';
            let location = '';
            let gender = '';
            let experience = '';
            let experienceFrom = undefined;
            let experienceTo = undefined;
            let salary = '';
            let salaryFrom = undefined;
            let salaryTo = undefined;
            let education = '';
            let careerLevel = '';
            let companySizeFrom = undefined;
            let companySizeTo = undefined;

            if (filter.Query) {
                const response = await openaiClient.chat.completions.create({
                    messages: [
                        { role: 'system', content: systemPrompt },
                        {
                            role: 'user',
                            content: filter.Query,
                        },
                    ],
                    model: 'gpt-4o',
                    temperature: 0.1,
                    max_tokens: 4096,
                    top_p: 0.1,
                });
                const content = response.choices[0].message.content;
                logger.info('Content: ' + content);
                // use regular expression to extract the job filter
                const regex =
                    /^JobNameKeyword: (.*?), CompanyNameKeyword: (.*?), Industry: (.*?), JobType: (.*?), Location: (.*?), Gender: (.*?), ExperienceFrom: (.*?), ExperienceTo: (.*?), SalaryFrom: (.*?), SalaryTo: (.*?), Education: (.*?), CareerLevel: (.*?), CompanySizeFrom: (.*?), CompanySizeTo: (.*?)$/;

                // flags to regex from multiple lines
                const match = content.match(regex);
                if (match) {
                    jobNameKeyword = convertParamsString(match[1]);
                    companyNameKeyword = convertParamsString(match[2]);
                    industry = convertParamsString(match[3]);
                    jobType = convertParamsString(match[4]);
                    location = convertParamsString(match[5]);
                    gender = convertParamsString(match[6]);
                    experienceFrom = convertParamsNumber(match[7]);
                    experienceTo = convertParamsNumber(match[8]);
                    salaryFrom = convertParamsNumber(match[9]);
                    salaryTo = convertParamsNumber(match[10]);
                    education = convertParamsString(match[11]);
                    careerLevel = convertParamsString(match[12]);
                    companySizeFrom = convertParamsNumber(match[13]);
                    companySizeTo = convertParamsNumber(match[14]);
                }
                logger.info('JobNameKeyword: ' + jobNameKeyword);
                logger.info('CompanyNameKeyword: ' + companyNameKeyword);
                logger.info('Industry: ' + industry);
                logger.info('Job Type: ' + jobType);
                logger.info('Location: ' + location);
                logger.info('Gender: ' + gender);
                logger.info('ExperienceFrom: ' + experienceFrom);
                logger.info('ExperienceTo: ' + experienceTo);
                logger.info('SalaryFrom: ' + salaryFrom);
                logger.info('SalaryTo: ' + salaryTo);
                logger.info('Education: ' + education);
                logger.info('CareerLevel: ' + careerLevel);
                logger.info('CompanySizeFrom: ' + companySizeFrom);
                logger.info('CompanySizeTo: ' + companySizeTo);
            }

            if (filter.Industry) {
                industry = filter.Industry;
            }
            if (filter.JobType) {
                jobType = filter.JobType;
            }
            if (filter.Location) {
                location = filter.Location;
            }
            if (filter.Experience) {
                experience = filter.Experience;
                experienceFrom = null;
                experienceTo = null;
            }
            if (filter.Salary) {
                salary = filter.Salary;
                salaryFrom = null;
                salaryTo = null;
            }
            if (filter.Education) {
                education = filter.Education;
            }
            if (filter.CareerLevel) {
                careerLevel = filter.CareerLevel;
            }

            const detailResult = await neo4jSession.run(
                `
                    MATCH (j:Job)-[:FROM]->(c:Company)
                    WHERE
                        (($JobNameKeyword IS NULL AND $CompanyNameKeyword IS NULL AND $Industry IS NULL) OR toLower(j.JobTitle) CONTAINS toLower($JobNameKeyword) OR toLower(c.CompanyName) CONTAINS toLower($CompanyNameKeyword) OR toLower(j.Industry) CONTAINS toLower($Industry))  AND
                        ($JobType IS NULL OR toLower(j.JobType) CONTAINS toLower($JobType)) AND
                        ($Location IS NULL OR toLower(j.JobAddress) CONTAINS toLower($Location)) AND
                        ($Gender IS NULL OR j.Gender = "Không yêu cầu" OR toLower(j.Gender) = toLower($Gender)) AND
                        (
                            ($Experience IS NULL AND (($ExperienceFrom IS NULL OR j.ExperienceTo >= $ExperienceFrom) AND ($ExperienceTo IS NULL OR j.ExperienceFrom <= $ExperienceTo)))
                            OR toLower(j.YearsofExperience) = toLower($Experience)
                        ) AND
                        (
                            ($Salary IS NULL AND (($SalaryFrom IS NULL OR j.SalaryTo >= $SalaryFrom) AND ($SalaryTo IS NULL OR j.SalaryFrom <= $SalaryTo)))
                            OR toLower(j.Salary) = toLower($Salary)
                        ) AND
                        (
                            ($CompanySizeFrom IS NULL OR c.CompanySizeTo >= $CompanySizeFrom)
                            AND ($CompanySizeTo IS NULL OR c.CompanySizeFrom <= $CompanySizeTo)
                        ) AND
                        ($Education IS NULL OR toLower(j.JobRequirements) CONTAINS toLower($Education)) AND
                        ($CareerLevel IS NULL OR toLower(j.CareerLevel) CONTAINS toLower($CareerLevel))
                    RETURN j, c
                    SKIP $skip LIMIT $limit
                `,
                {
                    JobNameKeyword: jobNameKeyword || null,
                    CompanyNameKeyword: companyNameKeyword || null,
                    Industry: industry || null,
                    JobType: jobType || null,
                    Location: location || null,
                    Gender: gender || null,
                    Experience: experience || null,
                    Salary: salary || null,
                    Education: education || null,
                    CareerLevel: careerLevel || null,
                    ExperienceFrom: experienceFrom || null,
                    ExperienceTo: experienceTo || null,
                    SalaryFrom: salaryFrom || null,
                    SalaryTo: salaryTo || null,
                    CompanySizeFrom: companySizeFrom || null,
                    CompanySizeTo: companySizeTo || null,
                    skip: convertIntegerToNeo4jInteger(skip),
                    limit: convertIntegerToNeo4jInteger(limit),
                },
            );
            const jobs = detailResult.records.map(record => {
                const jobProperties = record.get('j').properties;
                const submissionDeadline = jobProperties.SubmissionDeadline
                    ? {
                          year: convertNeo4jIntegerToInteger(
                              jobProperties.SubmissionDeadline.year,
                          ),
                          month: convertNeo4jIntegerToInteger(
                              jobProperties.SubmissionDeadline.month,
                          ),
                          day: convertNeo4jIntegerToInteger(
                              jobProperties.SubmissionDeadline.day,
                          ),
                      }
                    : null;
                const companyProperties = record.get('c').properties;
                return {
                    ...jobProperties,
                    SubmissionDeadline: submissionDeadline,
                    JobID: convertNeo4jIntegerToInteger(jobProperties.JobID),
                    NumberCandidate: convertNeo4jIntegerToInteger(
                        jobProperties.NumberCandidate,
                    ),
                    ...companyProperties,
                    CompanyID: convertNeo4jIntegerToInteger(
                        companyProperties.CompanyID,
                    ),
                };
            });

            // Query to get total count of jobs matching the filters
            const totalCountResult = await neo4jSession.run(
                `
                    MATCH (j:Job)-[:FROM]->(c:Company)
                    WHERE
                        (($JobNameKeyword IS NULL AND $CompanyNameKeyword IS NULL AND $Industry IS NULL) OR toLower(j.JobTitle) CONTAINS toLower($JobNameKeyword) OR toLower(c.CompanyName) CONTAINS toLower($CompanyNameKeyword) OR toLower(j.Industry) CONTAINS toLower($Industry))  AND
                        ($JobType IS NULL OR toLower(j.JobType) CONTAINS toLower($JobType)) AND
                        ($Location IS NULL OR toLower(j.JobAddress) CONTAINS toLower($Location)) AND
                        ($Gender IS NULL OR j.Gender = "Không yêu cầu" OR toLower(j.Gender) = toLower($Gender)) AND
                        (
                            ($Experience IS NULL AND (($ExperienceFrom IS NULL OR j.ExperienceTo >= $ExperienceFrom) AND ($ExperienceTo IS NULL OR j.ExperienceFrom <= $ExperienceTo)))
                            OR toLower(j.YearsofExperience) = toLower($Experience)
                        ) AND
                        (
                            ($Salary IS NULL AND (($SalaryFrom IS NULL OR j.SalaryTo >= $SalaryFrom) AND ($SalaryTo IS NULL OR j.SalaryFrom <= $SalaryTo)))
                            OR toLower(j.Salary) = toLower($Salary)
                        ) AND
                        (
                            ($CompanySizeFrom IS NULL OR c.CompanySizeTo >= $CompanySizeFrom)
                            AND ($CompanySizeTo IS NULL OR c.CompanySizeFrom <= $CompanySizeTo)
                        ) AND
                        ($Education IS NULL OR toLower(j.JobRequirements) CONTAINS toLower($Education)) AND
                        ($CareerLevel IS NULL OR toLower(j.CareerLevel) CONTAINS toLower($CareerLevel))
                    RETURN count(j) AS totalCount
                `,
                {
                    JobNameKeyword: jobNameKeyword || null,
                    CompanyNameKeyword: companyNameKeyword || null,
                    Industry: industry || null,
                    JobType: jobType || null,
                    Location: location || null,
                    Gender: gender || null,
                    Experience: experience || null,
                    Salary: salary || null,
                    Education: education || null,
                    CareerLevel: careerLevel || null,
                    ExperienceFrom: experienceFrom || null,
                    ExperienceTo: experienceTo || null,
                    SalaryFrom: salaryFrom || null,
                    SalaryTo: salaryTo || null,
                    CompanySizeFrom: companySizeFrom || null,
                    CompanySizeTo: companySizeTo || null,
                    skip: convertIntegerToNeo4jInteger(skip),
                    limit: convertIntegerToNeo4jInteger(limit),
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
            return {
                docs: [],
                totalDocs: 0,
                limit: filter.limit || 10,
                totalPages: 0,
                page: filter.page || 1,
                hasPrevPage: false,
                hasNextPage: false,
                prevPage: null,
                nextPage: null,
            };
        } finally {
            await neo4jSession.close();
        }
    }
    // Get job details by ID
    async getJobById(jobId: string) {
        const driver = getNeo4jDriver();
        const session = driver.session();

        try {
            const result = await session.run(
                `
                MATCH (j:Job {JobID: $jobId})-[:FROM]->(c:Company)
                MATCH (j)-[:RELATED_TO]->(relatedJob:Job)
                MATCH (relatedJob)-[:FROM]->(relatedCompany:Company)
                RETURN j, c, relatedJob, relatedCompany
                `,
                {
                    jobId: convertIntegerToNeo4jInteger(jobId),
                },
            );
            if (result.records.length === 0) {
                return null;
            }

            const job = result.records[0].get('j').properties;
            const company = result.records[0].get('c').properties;
            const RelatedJobs = result.records.map(record => {
                const relatedJob = record.get('relatedJob').properties;
                const relatedCompany = record.get('relatedCompany').properties;

                return {
                    ...relatedJob,
                    JobID: convertNeo4jIntegerToInteger(relatedJob.JobID),
                    NumberCandidate: convertNeo4jIntegerToInteger(
                        relatedJob.NumberCandidate,
                    ),
                    ...relatedCompany,
                    CompanyID: convertNeo4jIntegerToInteger(
                        relatedCompany.CompanyID,
                    ),
                };
            });
            const submissionDeadline = job.SubmissionDeadline
                ? {
                      year: convertNeo4jIntegerToInteger(
                          job.SubmissionDeadline.year,
                      ),
                      month: convertNeo4jIntegerToInteger(
                          job.SubmissionDeadline.month,
                      ),
                      day: convertNeo4jIntegerToInteger(
                          job.SubmissionDeadline.day,
                      ),
                  }
                : null;

            return {
                ...job,
                SubmissionDeadline: submissionDeadline,
                JobID: convertNeo4jIntegerToInteger(job.JobID),
                NumberCandidate: convertNeo4jIntegerToInteger(
                    job.NumberCandidate,
                ),
                ...company,
                CompanyID: convertNeo4jIntegerToInteger(company.CompanyID),
                RelatedJobs,
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
        // const driver = getNeo4jDriver();
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
        const driver = getNeo4jDriver();
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
                jobId: convertIntegerToNeo4jInteger(jobId),
                ...updateDto,
            });

            const updatedJob = result.records[0].get('j').properties;
            return {
                ...updatedJob,
                JobID: convertNeo4jIntegerToInteger(updatedJob.JobID),
                NumberofCandidate: convertNeo4jIntegerToInteger(
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
        const driver = getNeo4jDriver();
        const session = driver.session();

        try {
            const query = `
            MATCH (j:Job {JobID: $jobId})
            SET j.deleted = true
            RETURN j
        `;

            const result = await session.run(query, {
                jobId: convertIntegerToNeo4jInteger(jobId),
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
