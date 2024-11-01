// src/modules/user/validators/updateUserDtoValidator.ts

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Định nghĩa cấu trúc của DTO khi cập nhật User
const updateUserSchema = Joi.object({
    username: Joi.string().optional().messages({
        'string.empty': 'Name cannot be empty.',
    }),
    email: Joi.string().email().optional().messages({
        'string.email': 'Email must be a valid email address.',
    }),
    role: Joi.string()
        .valid('Employer', 'JobSeeker', 'Admin')
        .optional()
        .messages({
            'any.only': 'Role must be one of [Employer, JobSeeker, Admin].',
        }),
    profilePicture: Joi.string().uri().optional().messages({
        'string.uri': 'Profile picture must be a valid URL.',
    }),
    bio: Joi.string().optional().messages({
        'string.empty': 'Bio cannot be empty.',
    }),
    locationId: Joi.string().optional().messages({
        'string.empty': 'Location ID cannot be empty.',
    }),
})
    .min(1)
    .messages({
        'object.min': 'At least one field must be provided for update.',
    });

// Middleware xác thực dữ liệu cho DTO cập nhật User
export const updateUserDtoValidator = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { error } = updateUserSchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({ messages: errorMessages });
    }

    next();
};
