import Client from 'node-kubernetes-client';

const client = new Client({
    host: 'foo', // TODO - parameterise
    protocol: 'https', // TODO - parameterise
    version: 'v1',
    token: 'bar', // TODO - parameterise
    namespace: 'librum-ci'
});

export default client;
