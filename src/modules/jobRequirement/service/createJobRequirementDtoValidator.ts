import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const createJobRequirementSchema = Joi.object({
    jobId: Joi.string().required().messages({
        'string.empty': 'Job ID is required.',
    }),
    requirementDescription: Joi.string().required().messages({
        'string.empty': 'Requirement description is required.',
    }),
    requirementType: Joi.string()
        .valid('Skill', 'Education', 'Experience')
        .required()
        .messages({
            'any.only':
                'Requirement type must be either "Skill", "Education", or "Experience".',
        }),
});

export const createJobRequirementDtoValidator = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { error } = createJobRequirementSchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({ messages: errorMessages });
    }

    next();
};
