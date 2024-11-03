// src/modules/company/validators/createCompanyDtoValidator.ts

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Define the schema for creating a company
const createCompanySchema = Joi.object({
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
    companyTypeId: Joi.string().required().messages({
        'string.empty': 'Company Type ID is required.',
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

// Middleware to validate the data for creating a company
export const createCompanyDtoValidator = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { error } = createCompanySchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({ messages: errorMessages });
    }

    next();
};
