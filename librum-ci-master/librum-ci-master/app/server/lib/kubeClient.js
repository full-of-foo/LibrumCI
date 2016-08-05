import Promise from 'bluebird';
import Client from 'node-kubernetes-client';
import request from 'request';
import JSONStream from 'JSONStream';
import config from '../../../config';

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
    reqOpts.qs = {labelSelector: `name=${nameLabel}`, watch: true};

    console.log(`Streaming '${nameLabel}' until '${desiredPhase}'`);
    return new Promise((resolve, reject) => {
        request.get(reqOpts)
            .on('error', err => reject(pod))
            .pipe(JSONStream.parse([{emitKey: true}], data => {
                return (data && data.constructor === Object && 'kind' in data) ? data : null;
            }))
            .on('data', function(data) {
                const currentState = data.value.status.phase;
                if (currentState === desiredPhase) {
                    console.log(`${currentState}: destroying stream with '${nameLabel}'`);
                    this.destroy();
                    resolve(pod);
                }
                if (desiredPhase === 'Succeeded' && FAILED_POD_STATES.indexOf(currentState) > -1) {
                    console.log(`${currentState}: destroying stream with '${nameLabel}'`);
                    this.destroy();
                    reject(pod);
                }

                // TODO - assert container not in 'State: Waiting, Reason: RunContainerError'
            })
            .on('end', () => resolve(pod)); // TODO - remove?
    });
};

Client.prototype.deletePod = function(pod) {
    return new Promise((resolve, reject) => {
        console.log(`Deleting pod: ${pod.metadata.name}`);
        this.pods.delete(pod.metadata.name, (err, podRes) => err ? reject(err) : resolve(podRes));
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
