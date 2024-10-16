import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Define the schema for creating a job application
const createJobApplicationSchema = Joi.object({
    jobId: Joi.string().required().messages({
        'string.empty': 'Job ID is required.',
        'any.required': 'Job ID is required.',
    }),
    userId: Joi.string().required().messages({
        'string.empty': 'User ID is required.',
        'any.required': 'User ID is required.',
    }),
    applicationDate: Joi.date().optional().default(Date.now).messages({
        'date.base': 'Application Date must be a valid date.',
    }),
    applicationStatus: Joi.string().valid('Pending', 'Reviewed', 'Rejected').optional().default('Pending').messages({
        'any.only': 'Application Status must be one of "Pending", "Reviewed", or "Rejected".',
    }),
});

// Middleware to validate the data for creating a job application
export const createJobApplicationDtoValidator = (req: Request, res: Response, next: NextFunction) => {
    const { error } = createJobApplicationSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({ messages: errorMessages });
    }

    next();
};
