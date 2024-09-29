import express from 'express';

export function createModuleFactory({ path, name, bundler }) {
    const router = express.Router();

    return app => {
        bundler(router);
        name;
        app.use(path, router);
    };
}
