// src/modules/job/validators/updateJobDtoValidator.ts

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Define the schema for updating a job
const updateJobSchema = Joi.object({
    title: Joi.string().optional().messages({
        'string.empty': 'Title cannot be empty.',
    }),
    description: Joi.string().optional().messages({
        'string.empty': 'Description cannot be empty.',
    }),
    locationIds: Joi.array().optional().messages({
        'array.empty': 'Location ID cannot be empty.',
    }),
    employerId: Joi.string().optional().messages({
        'string.empty': 'Employer ID cannot be empty.',
    }),
    jobTypeId: Joi.string().optional().messages({
        'string.empty': 'Job Type ID cannot be empty.',
    }),
    salary: Joi.number().optional().messages({
        'number.base': 'Salary must be a number.',
    }),
    status: Joi.string().valid('Active', 'Closed').optional().messages({
        'any.only': 'Status must be either "Active" or "Closed".',
    }),
});

// Middleware to validate the data for updating a job
export const updateJobDtoValidator = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { error } = updateJobSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({ messages: errorMessages });
    }

    next();
};
