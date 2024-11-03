// src/modules/company/company.service.ts

import { omit } from 'lodash';
import { CompanyNotFoundException } from './exceptions/company.exceptions';
import { getNeo4jDriver } from '../../../system/database/neo4j';
import { logger } from './../../../system/logging/logger';
import {
    convertIntegerToNeo4jInteger,
    convertNeo4jIntegerToInteger,
} from '../../../utils/convert-integer-neo4j';
import {
    CompanyFilterByParams,
    JobsByCompanyIdFilter,
} from '../dto/companyFilter.dto';
import { CreateCompanyDto, UpdateCompanyDto } from '../dto/company.dto';

class CompanyService {
    async getAllCompanies(filter: CompanyFilterByParams) {
        const driver = getNeo4jDriver();
        const session = driver.session();

        try {
            const page = filter.page || 1;
            const limit = filter.limit || 10;
            const skip = (page - 1) * limit;

            const detailResult = await session.run(
                `
                MATCH (c:Company)
                WHERE
                    ($CompanyAddress IS NULL OR toLower(c.CompanyAddress) CONTAINS toLower($CompanyAddress)) AND
                    ($CompanySize IS NULL OR toLower(c.CompanySize) = toLower($CompanySize))
                RETURN c
                SKIP $skip LIMIT $limit
                `,
                {
                    CompanyAddress: filter.CompanyAddress || null,
                    CompanySize: filter.CompanySize || null,
                    skip: convertIntegerToNeo4jInteger(skip),
                    limit: convertIntegerToNeo4jInteger(limit),
                },
            );
            const companies = detailResult.records.map(record => {
                const properties = record.get('c').properties;
                return {
                    ...properties,
                    CompanyID: convertNeo4jIntegerToInteger(
                        properties.CompanyID,
                    ),
                };
            });

            const totalCountResult = await session.run(
                `MATCH (c:Company)
                WHERE
                    ($CompanyAddress IS NULL OR toLower(c.CompanyAddress) CONTAINS toLower($CompanyAddress)) AND
                    ($CompanySize IS NULL OR toLower(c.CompanySize) = toLower($CompanySize))
                RETURN count(c) AS totalCount
                `,
                {
                    CompanyAddress: filter.CompanyAddress || null,
                    CompanySize: filter.CompanySize || null,
                },
            );

            const totalDocs = totalCountResult.records[0]
                .get('totalCount')
                .toNumber();
            const totalPages = Math.ceil(totalDocs / limit);
            const hasNextPage = page < totalPages;
            const hasPrevPage = page > 1;

            return {
                docs: companies,
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
            logger.error('Error fetching companies from Neo4j:' + error);
            throw error;
        } finally {
            await session.close();
        }
    }
    // Get company details by ID
    async getCompanyById(companyId: string) {
        const driver = getNeo4jDriver();
        const session = driver.session();

        try {
            const result = await session.run(
                `
                MATCH (c:Company {CompanyID: $CompanyId})
                RETURN c
                `,
                {
                    CompanyId: convertIntegerToNeo4jInteger(companyId),
                },
            );
            if (result.records.length === 0) {
                return null;
            }

            const company = result.records[0].get('c').properties;

            return {
                ...company,
                CompanyID: convertNeo4jIntegerToInteger(company.CompanyID),
            };
        } catch (error) {
            logger.error('Error fetching company by ID from Neo4j: ' + error);
            throw error;
        } finally {
            await session.close();
        }
    }

    // Get Jobs by CompanyId
    async getJobsByCompanyId(filter: JobsByCompanyIdFilter) {
        const driver = getNeo4jDriver();
        const session = driver.session();

        try {
            const page = filter.page || 1;
            const limit = filter.limit || 10;
            const skip = (page - 1) * limit;

            const detailResult = await session.run(
                `
                MATCH (c:Company {CompanyID: $CompanyId})<-[:FROM]-(j:Job)
                RETURN j, c
                SKIP $skip LIMIT $limit
                `,
                {
                    CompanyId: convertIntegerToNeo4jInteger(filter.CompanyId),
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

            const totalCountResult = await session.run(
                `
                MATCH (c:Company {CompanyID: $companyId})<-[:FROM]-(j:Job)
                RETURN count(j) AS totalCount
                `,
                {
                    companyId: convertIntegerToNeo4jInteger(filter.CompanyId),
                },
            );

            const totalDocs = totalCountResult.records[0]
                .get('totalCount')
                .toNumber();
            const totalPages = Math.ceil(totalDocs / filter.limit);
            const hasNextPage = filter.page < totalPages;
            const hasPrevPage = filter.page > 1;

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
            logger.error('Error fetching company by ID from Neo4j: ' + error);
            throw error;
        } finally {
            await session.close();
        }
    }

    // Create a new company
    async createCompany(createDto: CreateCompanyDto) {
        // const driver = getNeo4jDriver();
        // const session = driver.session();
        // try {
        //     const query = `
        //     CREATE (j:Company {
        //         CompanyID: $CompanyID,
        //         Title: $Title,
        //         Industry: $Industry,
        //         CompanyType: $CompanyType,
        //         CompanyAddress: $CompanyAddress,
        //         YearsofExperience: $YearsofExperience,
        //         Salary: $Salary,
        //         CompanyRequirements: $CompanyRequirements,
        //         CareerLevel: $CareerLevel,
        //         SubmissionDeadline: $SubmissionDeadline,
        //         NumberofCandidate: $NumberofCandidate
        //     })
        //     RETURN j
        // `;
        //     const result = await session.run(query, {
        //         CompanyID: neo4j.int(createDto.CompanyID),
        //         Title: createDto.Title,
        //         Industry: createDto.Industry,
        //         CompanyType: createDto.CompanyType,
        //         CompanyAddress: createDto.CompanyAddress,
        //         YearsofExperience: createDto.YearsofExperience,
        //         Salary: createDto.Salary,
        //         CompanyRequirements: createDto.CompanyRequirements,
        //         CareerLevel: createDto.CareerLevel,
        //         SubmissionDeadline: createDto.SubmissionDeadline,
        //         NumberofCandidate: neo4j.int(createDto.NumberofCandidate || 0),
        //     });
        //     const company = result.records[0].get('j').properties;
        //     return {
        //         ...company,
        //         CompanyID: convertNeo4jInteger(company.CompanyID),
        //         NumberofCandidate: convertNeo4jInteger(company.NumberofCandidate),
        //     };
        // } catch (error) {
        //     logger.error('Error creating company in Neo4j: ' + error);
        //     throw error;
        // } finally {
        //     await session.close();
        // }
        return {};
    }

    // Update an existing company by ID
    async updateCompany(companyId: string, updateDto: UpdateCompanyDto) {
        const driver = getNeo4jDriver();
        const session = driver.session();

        try {
            const setFields = Object.keys(updateDto)
                .map(key => `j.${key} = $${key}`)
                .join(', ');

            const query = `
            MATCH (j:Company {CompanyID: $companyId})
            SET ${setFields}
            RETURN j
        `;

            const result = await session.run(query, {
                companyId: convertIntegerToNeo4jInteger(companyId),
                ...updateDto,
            });

            const updatedCompany = result.records[0].get('j').properties;
            return {
                ...updatedCompany,
                CompanyID: convertNeo4jIntegerToInteger(
                    updatedCompany.CompanyID,
                ),
                NumberofCandidate: convertNeo4jIntegerToInteger(
                    updatedCompany.NumberofCandidate,
                ),
            };
        } catch (error) {
            logger.error('Error updating company in Neo4j: ' + error);
            throw error;
        } finally {
            await session.close();
        }
    }

    // Soft delete a company by ID
    async deleteCompany(companyId: string) {
        const driver = getNeo4jDriver();
        const session = driver.session();

        try {
            const query = `
            MATCH (j:Company {CompanyID: $companyId})
            SET j.deleted = true
            RETURN j
        `;

            const result = await session.run(query, {
                companyId: convertIntegerToNeo4jInteger(companyId),
            });
            return result.records.length > 0;
        } catch (error) {
            logger.error('Error soft deleting company in Neo4j: ' + error);
            throw error;
        } finally {
            await session.close();
        }
    }
}

export const companyService = new CompanyService();
