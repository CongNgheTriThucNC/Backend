import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Định nghĩa cấu trúc của DTO cho Location
const locationSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Location name is required.',
        'any.required': 'Location name cannot be empty.',
    }),
    type: Joi.string().valid('City', 'Mountain', 'Island').required().messages({
        'any.only': 'Location type must be one of [City, Mountain, Island].',
        'any.required': 'Location type is required.',
    }),
});

// Middleware xác thực dữ liệu cho Location DTO
export const locationDtoValidator = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { error } = locationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};
