import Client from 'node-kubernetes-client';
import config from '../../../config';

const client = new Client({
    host: config.kubeMasterUri,
    protocol: 'https',
    version: 'v1',
    token: config.kubeToken,
    namespace: 'librum-ci'
});

export default client;
