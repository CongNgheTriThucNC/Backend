import { LocationModel } from '../../../system/model/localtion.schema';
import {
    LocationNotFoundException,
    DuplicateLocationException,
} from '../service';

class LocationService {
    // Tạo một địa điểm mới
    async createLocation(locationDto) {
        const { name, type } = locationDto;

        // Kiểm tra xem địa điểm đã tồn tại chưa
        const existingLocation = await LocationModel.findOne({ name }).lean();
        if (existingLocation) {
            throw new DuplicateLocationException();
        }

        // Tạo địa điểm mới
        const newLocation = await LocationModel.create({
            name,
            type,
        });

        return newLocation;
    }

    // Lấy thông tin địa điểm theo ID
    async getLocationById(locationId) {
        const location = await LocationModel.findById(locationId).lean();

        if (!location) {
            throw new LocationNotFoundException();
        }

        return location;
    }

    // Cập nhật thông tin địa điểm theo ID
    async updateLocation(locationId, updateLocationDto) {
        const location = await LocationModel.findById(locationId);

        if (!location) {
            throw new LocationNotFoundException();
        }

        Object.assign(location, updateLocationDto);

        await location.save();

        return location;
    }

    // Xóa địa điểm theo ID
    async deleteLocation(locationId) {
        const location = await LocationModel.findByIdAndDelete(locationId);

        if (!location) {
            throw new LocationNotFoundException();
        }

        return location;
    }

    // Lấy danh sách tất cả các địa điểm
    async getAllLocations() {
        const locations = await LocationModel.find().lean();

        return locations;
    }
}

// Xuất LocationService ra ngoài để có thể sử dụng trong controller
export const locationService = new LocationService();
