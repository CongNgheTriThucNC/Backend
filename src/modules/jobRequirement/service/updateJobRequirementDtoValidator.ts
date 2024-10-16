import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const updateJobRequirementSchema = Joi.object({
    jobId: Joi.string().optional().messages({
        'string.empty': 'Job ID cannot be empty.',
    }),
    requirementDescription: Joi.string().optional().messages({
        'string.empty': 'Requirement description cannot be empty.',
    }),
    requirementType: Joi.string()
        .valid('Skill', 'Education', 'Experience')
        .optional()
        .messages({
            'any.only':
                'Requirement type must be either "Skill", "Education", or "Experience".',
        }),
});

export const updateJobRequirementDtoValidator = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { error } = updateJobRequirementSchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({ messages: errorMessages });
    }

    next();
};
