import Promise from 'bluebird';
import Client from 'node-kubernetes-client';
import request from 'request';
import JSONStream from 'JSONStream';
import config from '../../../config';
import {PodStreamError} from './exc';

const FAILED_POD_STATES = ['Failed', 'Unknown'];
const podsUrl = `https://${config.kubeMasterUri}/api/v1/namespaces/librum-ci/pods`;
const reqOpts = {
    url: podsUrl,
    json: true,
    strictSSL: false,
    auth: {bearer: config.kubeToken}
};

Client.prototype.streamPodUntilPhase = function(pod, desiredPhase = 'Succeeded') {
    const nameLabel = pod.metadata.labels.name;
    const opts = Object.assign({}, reqOpts);
    opts.qs = {labelSelector: `name=${nameLabel}`, watch: true};

    console.log(`Streaming '${nameLabel}' until '${desiredPhase}'`);
    return new Promise((resolve, reject) => {
        request.get(opts)
            .on('error', err => reject(pod))
            .pipe(JSONStream.parse([{emitKey: true}], data => {
                return (data && data.constructor === Object && 'kind' in data) ? data : null;
            }))
            .on('data', function(data) {
                const currentState = data.value.status.phase;
                if (currentState === desiredPhase) {
                    console.log(`${currentState}: destroying stream with '${nameLabel}'`);
                    this.destroy();
                }
                if (desiredPhase === 'Succeeded' && FAILED_POD_STATES.indexOf(currentState) > -1) {
                    console.log(`${currentState}: destroying stream with '${nameLabel}'`);
                    this.error = new PodStreamError(currentState, pod);
                    this.destroy();
                }
            })
            .on('close', function() {
                this.error ? reject(this.error) : resolve(pod);
            });
    });
};

Client.prototype.getPodLogs = function(pod) {
    const opts = Object.assign({}, reqOpts);
    opts.url = `${podsUrl}/${pod.metadata.name}/log`;
    return new Promise((resolve, reject) => {
        request.get(opts, (err, res, body) => {
            if (err) reject(pod);
            resolve(body);
        });
    });
};

Client.prototype.deletePod = function(pod) {
    return new Promise((resolve, reject) => {
        console.log(`Deleting pod: ${pod.metadata.name}`);
        this.pods.delete(pod.metadata.name, (err, podRes) => err ? reject(err) : resolve(podRes));
    });
};

Client.prototype.getServiceByName = function(name) {
    return new Promise((resolve, reject) => {
        console.log(`Getting service: ${name}`);
        this.services.get(name, (err, service) => err ? reject(err) : resolve(service));
    });
};

const client = new Client({
    host: config.kubeMasterUri,
    protocol: 'https',
    version: 'v1',
    token: config.kubeToken,
    namespace: 'librum-ci'
});

export default client;
