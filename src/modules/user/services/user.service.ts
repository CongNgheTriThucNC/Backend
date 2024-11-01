// src/modules/user/service/userService.ts

import { omit } from 'lodash';
import {
    UserNotFoundException,
    EmailAlreadyInUseException,
} from '../exceptions/user.exceptions';
import { UserModel, IUser } from '../../../system/model';

class UserService {
    // Lấy danh sách tất cả người dùng
    async getAllUsers(userQuery: any) {
        let query: any = {};
        if (userQuery.search) {
            query.$text = { $search: userQuery.search };
        }

        let sortOptions: any = {};
        if (userQuery.sort) {
            sortOptions = userQuery.sort;
        }

        const options = {
            page: userQuery.page || 1,
            limit: userQuery.limit || 10,
            sort: sortOptions,
        };
        const result = await UserModel.paginate(query, options);
        return result;
    }

    // Lấy thông tin người dùng theo ID
    async getUserById(userId: string) {
        const user = await UserModel.findById(userId)
            .select('-password')
            .lean();

        if (!user) {
            throw new UserNotFoundException();
        }

        return user;
    }

    // Cập nhật thông tin người dùng
    async updateUser(userId: string, updateDto: Partial<IUser>) {
        try {
                    // Nếu email được cập nhật, kiểm tra xem email đã được sử dụng chưa
        if (updateDto.email) {
            const existingUser = await UserModel.findOne({
                email: updateDto.email,
                _id: { $ne: userId },
            }).lean();
            if (existingUser) {
                throw new EmailAlreadyInUseException();
            }
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $set: updateDto },
            { new: true, runValidators: true, select: '-password' },
        ).lean();

        if (!updatedUser) {
            throw new UserNotFoundException();
        }
        return updatedUser;

        } catch (error) {
            throw error.message;
        }

    }

    // Xóa người dùng theo ID
    async deleteUser(userId: string) {
        const deletedUser = await UserModel.findByIdAndDelete(userId).lean();

        if (!deletedUser) {
            throw new UserNotFoundException();
        }

        return;
    }
}

export const userService = new UserService();
