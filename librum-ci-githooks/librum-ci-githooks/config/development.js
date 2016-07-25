const dbUri = 'mongo/librum-ci-dev';

const librumMasterHost = process.env.LIBRUMCI_LIBRUM_CI_MASTER_1_PORT_8080_TCP_ADDR;
const librumMasterPort = process.env.LIBRUMCI_LIBRUM_CI_MASTER_1_PORT_8080_TCP_PORT;
const librumMasterUri = `http://${librumMasterHost}:${librumMasterPort}`;

export default {
    'dbUri': dbUri,
    'librumMasterUri': librumMasterUri,
    'isSeeded': true
};
