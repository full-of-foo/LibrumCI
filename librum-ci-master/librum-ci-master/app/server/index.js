import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import errorhandler from 'errorhandler';
import Promise from 'bluebird';
import { db } from 'librum-ci-models';
import config from '../../config';
import middleware from './middleware';
import apiRouter from './api';

const createServer = () => {
    const app = express();
    app.server = http.createServer(app);

    app.use(cors({exposedHeaders: ['Link']}));
    app.use(bodyParser.json({limit : '100kb'}));
    app.use(errorhandler());
    Promise.onPossiblyUnhandledRejection(error => {
        throw error;
    });

    db(config, () => {
        app.use(middleware());
        app.use('/api', apiRouter);

        app.server.listen(process.env.PORT || 8080);
        console.log(`Started on port ${app.server.address().port}`);
        return app;
    });
};

export default createServer;
