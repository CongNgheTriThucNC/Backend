import { swaggerBuilder } from '../../system/swagger';
import { PropertyFactory } from '../../system/swagger/core/property.factory';
import { createModuleFactory } from '../../system/factories/module.factory';
import { createHandler } from '../../system/factories';
import { HttpResponseBuilder } from '../../system/builders/http-response.builder';
import {
    locationDtoValidator,
    updateLocationDtoValidator,
    locationService,
} from './service';

const MODULE_NAME = 'Location';
export const createLocationModule = createModuleFactory({
    path: '/locations',
    name: MODULE_NAME,
    bundler: router => {
        swaggerBuilder.addTag(MODULE_NAME);

        // Define Location DTO model
        const LOCATION_DTO_NAME = 'LocationDto';
        swaggerBuilder.addModel({
            name: LOCATION_DTO_NAME,
            properties: {
                name: PropertyFactory.createProperty({ type: 'string' }),
                type: PropertyFactory.createProperty({ type: 'string' }),
            },
        });

        // Define GET /locations route
        swaggerBuilder.addRoute({
            route: '/locations',
            tags: [MODULE_NAME],
            method: 'get',
        });
        router.get(
            '/',
            createHandler(async (req, res) => {
                const locations = await locationService.getAllLocations();
                return HttpResponseBuilder.buildOK(res, locations);
            }),
        );

        // Define POST /locations route
        swaggerBuilder.addRoute({
            route: '/locations',
            body: LOCATION_DTO_NAME,
            tags: [MODULE_NAME],
            method: 'post',
        });
        router.post(
            '/',
            locationDtoValidator,
            createHandler(async (req, res) => {
                const locationDto = {
                    name: req.body.name,
                    type: req.body.type,
                };

                const newLocation =
                    await locationService.createLocation(locationDto);

                return HttpResponseBuilder.buildOK(res, newLocation);
            }),
        );

        // Define GET /locations/:id route
        swaggerBuilder.addRoute({
            route: '/locations/{id}',
            tags: [MODULE_NAME],
            method: 'get',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Location ID',
                    required: true,
                }),
            ],
        });
        router.get(
            '/:id',
            createHandler(async (req, res) => {
                const locationId = req.params.id;
                const location =
                    await locationService.getLocationById(locationId);

                return HttpResponseBuilder.buildOK(res, location);
            }),
        );

        // Define PUT /locations/:id route
        swaggerBuilder.addRoute({
            route: '/locations/{id}',
            body: LOCATION_DTO_NAME,
            tags: [MODULE_NAME],
            method: 'patch',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Location ID',
                    required: true,
                }),
            ],
        });
        router.patch(
            '/:id',
            updateLocationDtoValidator,
            createHandler(async (req, res) => {
                const locationId = req.params.id;
                const updateDto = {
                    name: req.body.name,
                    type: req.body.type,
                };

                const updatedLocation = await locationService.updateLocation(
                    locationId,
                    updateDto,
                );

                return HttpResponseBuilder.buildOK(res, updatedLocation);
            }),
        );

        // Define DELETE /locations/:id route
        swaggerBuilder.addRoute({
            route: '/locations/{id}',
            tags: [MODULE_NAME],
            method: 'delete',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Location ID',
                    required: true,
                }),
            ],
        });
        router.delete(
            '/:id',
            createHandler(async (req, res) => {
                const locationId = req.params.id;
                await locationService.deleteLocation(locationId);

                return HttpResponseBuilder.buildNoContent(res);
            }),
        );
    },
});
