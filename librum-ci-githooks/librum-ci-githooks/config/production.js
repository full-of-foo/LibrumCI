const dbUri = 'mongo/librum-ci';
const librumMasterUri = `http://${process.env.LIBRUM_CI_MASTER_SERVICE_HOST}`;

export default {
    'dbUri': dbUri,
    'librumMasterUri': librumMasterUri,
    'isSeeded': false
};
