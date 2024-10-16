import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Define the schema for updating a job application
const updateJobApplicationSchema = Joi.object({
    jobId: Joi.string().optional().messages({
        'string.empty': 'Job ID cannot be empty.',
    }),
    userId: Joi.string().optional().messages({
        'string.empty': 'User ID cannot be empty.',
    }),
    applicationDate: Joi.date().optional().messages({
        'date.base': 'Application Date must be a valid date.',
    }),
    applicationStatus: Joi.string().valid('Pending', 'Reviewed', 'Rejected').optional().messages({
        'any.only': 'Application Status must be one of "Pending", "Reviewed", or "Rejected".',
    }),
});

// Middleware to validate the data for updating a job application
export const updateJobApplicationDtoValidator = (req: Request, res: Response, next: NextFunction) => {
    const { error } = updateJobApplicationSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({ messages: errorMessages });
    }

    next();
};
