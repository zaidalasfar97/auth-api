'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const notFoundHandler = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');
const logger = require('./api-server/middleware/logger.js');

const v1Routes = require('./api-server/routes/v1.js');
const v2Routes = require('./api-server/routes/v2.js');
const authRoutes = require('./auth-server/routes.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(cors());
app.use(morgan('dev'));

app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);
app.use(authRoutes);

app.use('*', notFoundHandler);
app.use(errorHandler);

module.exports = {
    server: app,
    start: port => {
        if (!port) { throw new Error("Missing Port"); }
        app.listen(port, () => console.log(`Listening on ${port}`));
    },
};