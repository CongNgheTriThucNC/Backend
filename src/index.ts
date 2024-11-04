import express from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import { createRootModule } from './modules';
import { errorHandler } from './system/exceptions/error-handler/error-handler';
import { connectDatabase } from './system/database/database.connector';
import { notFoundHandler } from './system/exceptions/error-handler/';
import { swaggerBuilder } from './system/swagger';
import { logger } from './system/logging/logger';
import { initNeo4jDriver as initNeo4jDriver } from './system/database/neo4j';
import dotenv from 'dotenv';
import { initOpenAI } from './system/llm/openai.connector';

// import { authenticationRouter } from './system/middleware/';

const app = express();
const port = 3000;
app.get('/', (req, res) => {
    res.json({
        Swagger: 'http://localhost:3000/docs',
    });
});
// render origin and railway origin
const originAllowCors = [
    'https://backend-production-b4ad.up.railway.app',
    'http://localhost:3001',
    'http://13.211.201.255:3000',
];
(async () => {
    dotenv.config();
    app.use(
        cors({
            origin: (origin, callback) => {
                if (originAllowCors.includes(origin) || !origin) {
                    callback(null, true); // Allow the request
                } else {
                    callback(new Error('Not allowed by CORS')); // Reject the request
                }
            },
            credentials: true, // Allow credentials if needed
            optionsSuccessStatus: 200, // For older browsers
        }),
    );
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    // app.use(authenticationRouter);
    createRootModule(app);
    app.use(swaggerUi.serveWithOptions({ redirect: false }));
    app.use(swaggerUi.serve, swaggerUi.setup(swaggerBuilder.build()));
    app.use(notFoundHandler);
    app.use(errorHandler);
    await connectDatabase();
    await initNeo4jDriver(
        process.env.NEO4J_URI,
        process.env.NEO4J_USERNAME,
        process.env.NEO4J_PASSWORD,
    );
    initOpenAI(process.env.OPENAI_BASE_URL, process.env.OPENAI_API_KEY);
})();

app.listen(port, () => {
    logger.info(`Example app listening at http://localhost:${port}`);
    logger.info(`Swagger at http://localhost:${port}/docs`);
});
