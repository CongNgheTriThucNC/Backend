import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Define the schema for creating an employer
const createEmployerSchema = Joi.object({
    name: Joi.string().optional().messages({
        'string.empty': 'Name cannot be empty.',
    }),
    description: Joi.string().optional().messages({
        'string.empty': 'Description cannot be empty.',
    }),
    contactInfo: Joi.string().required().messages({
        'string.empty': 'Contact information is required.',
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
});

// Middleware to validate the data for creating an employer
export const createEmployerDtoValidator = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { error } = createEmployerSchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({ messages: errorMessages });
    }

    next();
};
