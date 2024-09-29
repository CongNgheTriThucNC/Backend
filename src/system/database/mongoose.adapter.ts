import mongoose from 'mongoose';
import { logger } from '../logging/logger';

export class MongooseAdapter {
    #count = 3;

    /**
     * @type {string}
     */
    #connectionString;

    /**
     * @type {import('mongoose')}
     */
    #mongooseInstance = mongoose;

    constructor(url) {
        this.#connectionString = url;
    }

    async connect() {
        let flag = false;

        try {
            await this.#mongooseInstance.connect(this.#connectionString);
            flag = true;
        } catch (error) {
            logger.error(`[${MongooseAdapter.name}] ${error.message}`);
            this.#count -= 1;
        }

        setTimeout(() => {
            if (!flag && this.#count) return this.connect();
        }, 3000);
    }
}
