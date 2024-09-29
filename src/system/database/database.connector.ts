import { MongooseAdapter } from './mongoose.adapter';
import { configStore } from '../config/';
import { logger } from '../logging/logger';

export function connectDatabase() {
    logger.info('Connecting to database...');
    logger.info(`Database URL: ${configStore.get('DATABASE_URL')}`);
    new MongooseAdapter(configStore.get('DATABASE_URL')).connect();
}
