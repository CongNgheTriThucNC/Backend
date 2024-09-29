/**
 *
 * @param fn
 * @return {function(...[*]): Promise<Awaited<*>>}
 * Fork code from express-async-handler
 * @link https://www.npmjs.com/package/express-async-handler
 */
export const createHandler = fn =>
    function asyncUtilWrap(...args) {
        const fnReturn = fn(...args);
        const next = args[args.length - 1];

        return Promise.resolve(fnReturn).catch(next);
    };
