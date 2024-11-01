import { swaggerBuilder } from '../../system/swagger';
import { PropertyFactory } from '../../system/swagger/core/property.factory';
import { createModuleFactory } from '../../system/factories/module.factory';
import { createHandler } from '../../system/factories';
import { HttpResponseBuilder } from '../../system/builders/http-response.builder';
import { updateUserDtoValidator, userService } from './services';

const MODULE_NAME = 'User';
export const createUserModule = createModuleFactory({
    path: '/users',
    name: MODULE_NAME,
    bundler: router => {
        swaggerBuilder.addTag(MODULE_NAME);

        // Define User DTO model
        const USER_DTO_NAME = 'UserDto';
        swaggerBuilder.addModel({
            name: USER_DTO_NAME,
            properties: {
                username: PropertyFactory.createProperty({ type: 'string' }),
                email: PropertyFactory.createProperty({ type: 'string' }),
                bio: PropertyFactory.createProperty({ type: 'string' }),
                role: PropertyFactory.createProperty({ type: 'string' }),
            },
        });

        // Define GET /users route (get all users)
        swaggerBuilder.addRoute({
            route: '/users',
            tags: [MODULE_NAME],
            method: 'get',
            params: [
                PropertyFactory.createParam({
                    name: 'limit',
                    paramsIn: 'query',
                    type: 'number?',
                    description: 'Number of items per page (limit)',
                    required: false,
                }),
                PropertyFactory.createParam({
                    name: 'page',
                    paramsIn: 'query',
                    type: 'number?',
                    description: 'Page number',
                    required: false,
                }),
                PropertyFactory.createParam({
                    name: 'search',
                    paramsIn: 'query',
                    type: 'string?',
                    description: 'Search query',
                    required: false,
                }),
                PropertyFactory.createParam({
                    name: 'sort',
                    paramsIn: 'query',
                    type: 'string?',
                    description: 'Sort query',
                    required: false,
                }),
            ],
        });
        router.get(
            '/',
            createHandler(async (req, res) => {
                const users = await userService.getAllUsers(req.query);
                return HttpResponseBuilder.buildOK(res, users);
            }),
        );

        // Define GET /users/:id route (get user by ID)
        swaggerBuilder.addRoute({
            route: '/users/{id}',
            tags: [MODULE_NAME],
            method: 'get',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'User ID',
                    required: true,
                }),
            ],
        });
        router.get(
            '/:id',
            createHandler(async (req, res) => {
                const userId = req.params.id;
                const user = await userService.getUserById(userId);

                return HttpResponseBuilder.buildOK(res, user);
            }),
        );

        // Define PATCH /users/:id route (update user by ID)
        swaggerBuilder.addRoute({
            route: '/users/{id}',
            body: USER_DTO_NAME,
            tags: [MODULE_NAME],
            method: 'patch',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'User ID',
                    required: true,
                }),
            ],
        });
        router.patch(
            '/:id',
            updateUserDtoValidator,
            createHandler(async (req, res) => {
                const userId = req.params.id;
                const updateDto = {
                    username: req.body.username,
                    email: req.body.email,
                    bio: req.body.bio,
                };

                const updatedUser = await userService.updateUser(
                    userId,
                    updateDto,
                );

                return HttpResponseBuilder.buildOK(res, updatedUser);
            }),
        );

        // Define DELETE /users/:id route (delete user by ID)
        swaggerBuilder.addRoute({
            route: '/users/{id}',
            tags: [MODULE_NAME],
            method: 'delete',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'User ID',
                    required: true,
                }),
            ],
        });
        router.delete(
            '/:id',
            createHandler(async (req, res) => {
                const userId = req.params.id;
                await userService.deleteUser(userId);

                return HttpResponseBuilder.buildNoContent(res);
            }),
        );
    },
});
