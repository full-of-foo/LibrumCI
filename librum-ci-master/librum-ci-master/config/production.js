import fs from 'fs';

const dbUri = 'mongo/librum-ci';

const kubeMasterHost = process.env.KUBERNETES_SERVICE_HOST;
const kubeMasterPort = process.env.KUBERNETES_PORT_443_TCP_PORT;
const kubeMasterUri = `${kubeMasterHost}:${kubeMasterPort}`;

const tokenPath = '/var/run/secrets/kubernetes.io/serviceaccount/token';
const kubeToken = fs.existsSync(tokenPath) ? fs.readFileSync(tokenPath, 'utf8') : null;

export default {
    'dbUri': dbUri,
    'kubeMasterUri': kubeMasterUri,
    'kubeToken': kubeToken,
    'isSeeded': false
};
