'use strict';
const logger = (req, res, next) => {

    try {
        console.log('REQUEST:', req.method, req.path);

        next();
    } catch (error) {
        throw new Error(error.message);
    }

}

module.exports = logger;