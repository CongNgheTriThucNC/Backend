import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Định nghĩa cấu trúc của DTO khi cập nhật Location
const updateLocationSchema = Joi.object({
    name: Joi.string().optional().messages({
        'string.empty': 'Location name cannot be empty.',
    }),
    type: Joi.string().valid('City', 'Mountain', 'Island').optional().messages({
        'any.only': 'Location type must be one of [City, Mountain, Island].',
    }),
});

// Middleware xác thực dữ liệu cho DTO cập nhật Location
export const updateLocationDtoValidator = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { error } = updateLocationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};
