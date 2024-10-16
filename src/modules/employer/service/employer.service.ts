import { omit } from 'lodash';
import { EmployerNotFoundException, EmailAlreadyInUseException } from './index';
import { EmployerModel, IEmployer } from '../../../system/model';

class EmployerService {
    // Get a paginated list of all employers
    async getAllEmployers(query: any) {
        let filter: any = {};
        if (query.search) {
            filter.$text = { $search: query.search };
        }

        const options = {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: query.sort || {},
        };

        const result = await EmployerModel.paginate(filter, options);
        return result;
    }

    // Get employer details by ID
    async getEmployerById(employerId: string) {
        const employer = await EmployerModel.findById(employerId).lean();
        if (!employer) {
            throw new EmployerNotFoundException();
        }
        return employer;
    }

    // Create a new employer
    async createEmployer(createDto: Partial<IEmployer>) {
        // Check if the email already exists
        if (createDto.email) {
            const existingEmployer = await EmployerModel.findOne({
                email: createDto.email,
            }).lean();
            if (existingEmployer) {
                throw new EmailAlreadyInUseException();
            }
        }

        const employer = new EmployerModel(createDto);
        return await employer.save();
    }

    // Update an existing employer by ID
    async updateEmployer(employerId: string, updateDto: Partial<IEmployer>) {
        // If the email is being updated, check if it already exists for another employer
        if (updateDto.email) {
            const existingEmployer = await EmployerModel.findOne({
                email: updateDto.email,
                _id: { $ne: employerId },
            }).lean();
            if (existingEmployer) {
                throw new EmailAlreadyInUseException();
            }
        }

        const updatedEmployer = await EmployerModel.findByIdAndUpdate(
            employerId,
            { $set: updateDto },
            { new: true, runValidators: true },
        ).lean();

        if (!updatedEmployer) {
            throw new EmployerNotFoundException();
        }

        return updatedEmployer;
    }

    // Soft delete an employer by ID
    async deleteEmployer(employerId: string) {
        const deletedEmployer = await EmployerModel.deleteById(employerId);
        if (!deletedEmployer) {
            throw new EmployerNotFoundException();
        }
        return;
    }
}

export const employerService = new EmployerService();
