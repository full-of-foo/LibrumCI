import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { db } from 'librum-ci-models';
import config from '../config';
import webhookHandler from './hooks';
import apiRouter from './api';

const app = express();
app.server = http.createServer(app);
app.use('/', webhookHandler);

app.use(cors({exposedHeaders: ['Link']}));
app.use(bodyParser.json({limit : '100kb'}));
app.use('/api', apiRouter);

db(config, () => {
    app.server.listen(process.env.PORT || 9001);
    console.log(`Started on port ${app.server.address().port}`);
});

export default app;
