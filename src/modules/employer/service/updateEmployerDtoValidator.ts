import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Define the schema for updating an employer
const updateEmployerSchema = Joi.object({
    name: Joi.string().optional().messages({
        'string.empty': 'Name cannot be empty.',
    }),
    description: Joi.string().optional().messages({
        'string.empty': 'Description cannot be empty.',
    }),
    contactInfo: Joi.string().optional().messages({
        'string.empty': 'Contact information cannot be empty.',
    }),
    company: Joi.string().optional().messages({
        'string.empty': 'Company cannot be empty.',
    }),
    website: Joi.string().uri().optional().messages({
        'string.uri': 'Website must be a valid URL.',
    }),
    email: Joi.string().email().optional().messages({
        'string.email': 'Email must be a valid email address.',
    }),
})
    .min(1)
    .messages({
        'object.min': 'At least one field must be provided for update.',
    });

// Middleware to validate the data for updating an employer
export const updateEmployerDtoValidator = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { error } = updateEmployerSchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({ messages: errorMessages });
    }

    next();
};
