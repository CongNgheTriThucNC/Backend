import { SwaggerBuilder } from './core/swagger.builder';
import { configStore } from '../config/';

const basePath =
    process.env.STAGE === 'local' ? `${process.env.STAGE}/api` : 'api';
export const swaggerBuilder = new SwaggerBuilder({
    openapi: '3.0.1',
    info: {
        version: '1.0.0',
        title: 'Script API Document',
        description: 'API description',
        termsOfService: '',
    },
    servers: [
        {
            url: `${configStore.get(
                'HOST',
                'http://localhost:3000',
            )}/${basePath}`,
            description: 'Local server',
            variables: {
                env: {
                    default: 'app-dev',
                    description: 'DEV Environment',
                },
                basePath: {
                    default: basePath,
                },
            },
        },
    ],
    basePath,
    auth: true,
});
