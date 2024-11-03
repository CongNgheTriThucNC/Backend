import { logger } from './../logging/logger';
import * as neo4j from 'neo4j-driver';
let driver: neo4j.Driver | null = null;

export async function initNeo4jDriver(
    uri: string,
    username: string,
    password: string,
): Promise<neo4j.Driver> {
    if (!driver) {
        driver = neo4j.driver(uri, neo4j.auth.basic(username, password));
        try {
            await driver.verifyConnectivity();
            logger.info('Connected to Neo4j');
        } catch (error) {
            logger.error('Error connecting to Neo4j ' + error);
            throw error;
        }
    }
    return driver;
}

export function getNeo4jDriver(): neo4j.Driver | null {
    return driver;
}

export async function closeNeo4jDriver(): Promise<void> {
    if (driver) {
        await driver.close();
        driver = null;
        logger.info('Neo4j driver closed');
    }
}
