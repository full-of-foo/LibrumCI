import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import GithubHookHandler from 'github-webhook-handler';
import apiRouter from './api';

const app = express();
const webhookHandler = GithubHookHandler({ path: '/', secret: 'lol' });

app.server = http.createServer(app);
app.use('/', webhookHandler);

app.use(cors({exposedHeaders: ['Link']}));
app.use(bodyParser.json({limit : '100kb'}));

app.use('/api', apiRouter);

webhookHandler.on('error', err => {
    console.error('Error:', err.message);
});

webhookHandler.on('push', event => {
    console.log('Received a push event for %s to %s',
        event.payload.repository.name,
        event.payload.ref);
});

app.server.listen(process.env.PORT || 9001);
console.log(`Started on port ${app.server.address().port}`);

export default app;
