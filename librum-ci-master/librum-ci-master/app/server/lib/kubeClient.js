import Client from 'node-kubernetes-client';
import request from 'request';
import JSONStream from 'JSONStream';
import config from '../../../config';

Client.prototype.streamPod = function(nameLabel, onError, onData) {
    const url = `https://${config.kubeMasterUri}/api/v1/namespaces/librum-ci/pods`;
    const qs = {labelSelector: `name=${nameLabel}`, watch: true};
    const opts = {
        url: url,
        qs: qs,
        json: true,
        strictSSL: false,
        resolveWithFullResponse: true,
        auth: {bearer: config.kubeToken}
    };

    return request.get(opts)
        .on('error', onError)
        .pipe(JSONStream.parse([{emitKey: true}], data => {
            return (data && data.constructor === Object && 'kind' in data) ? data : null;
        }))
        .on('data', onData);
};

const client = new Client({
    host: config.kubeMasterUri,
    protocol: 'https',
    version: 'v1',
    token: config.kubeToken,
    namespace: 'librum-ci'
});

export default client;
