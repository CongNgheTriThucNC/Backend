// src/modules/job/validators/createJobDtoValidator.ts

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Define the schema for creating a job
const createJobSchema = Joi.object({
    title: Joi.string().required().messages({
        'string.empty': 'Title is required.',
    }),
    description: Joi.string().required().messages({
        'string.empty': 'Description is required.',
    }),
    locationIds: Joi.array().required().messages({
        'array.empty': 'Location ID is required.',
    }),
    employerId: Joi.string().required().messages({
        'string.empty': 'Employer ID is required.',
    }),
    jobTypeId: Joi.string().required().messages({
        'string.empty': 'Job Type ID is required.',
    }),
    salary: Joi.number().required().messages({
        'number.base': 'Salary must be a number.',
    }),
    status: Joi.string()
        .valid('Active', 'Closed')
        .optional()
        .default('Active')
        .messages({
            'any.only': 'Status must be either "Active" or "Closed".',
        }),
});

// Middleware to validate the data for creating a job
export const createJobDtoValidator = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { error } = createJobSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({ messages: errorMessages });
    }

    next();
};
