// import { isNil } from 'lodash';
// import dotenv from 'dotenv';

// dotenv.config();

// export const configStore = {
//     /**
//      *
//      * @param {string} key
//      * @param {{ strict?: boolean } | string} optionsOrFallback
//      * @return {string}
//      */
//     get: (key, optionsOrFallback = { strict: true }) => {
//         const value = process.env[key];

//         if (isNil(value) && typeof optionsOrFallback === 'string') {
//             return optionsOrFallback;
//         }

//         if (
//             isNil(value) &&
//             typeof optionsOrFallback === 'object' &&
//             optionsOrFallback.strict
//         ) {
//             throw new Error(`Missing key: ${key}`);
//         }

//         return value;
//     },
// };
import { isNil } from 'lodash';
import dotenv from 'dotenv';

dotenv.config();

export const configStore = {
    /**
     * Retrieves the value for the specified key from the environment variables.
     *
     * @param {string} key - The key to look up in the environment variables.
     * @param {{ strict?: boolean } | string} [optionsOrFallback={ strict: true }] - Options or a fallback value.
     * @return {string} - The value for the specified key or the fallback value.
     * @throws {Error} - If the key is missing and strict mode is enabled.
     */
    get: (
        key: string,
        optionsOrFallback: { strict?: boolean } | string = { strict: true },
    ): string => {
        const value = process.env[key];

        if (isNil(value) && typeof optionsOrFallback === 'string') {
            return optionsOrFallback;
        }

        if (
            isNil(value) &&
            typeof optionsOrFallback === 'object' &&
            optionsOrFallback.strict
        ) {
            throw new Error(`Missing key: ${key}`);
        }

        return value as string;
    },
};
