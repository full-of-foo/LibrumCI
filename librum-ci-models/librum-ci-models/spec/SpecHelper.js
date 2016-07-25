process.env.NODE_ENV = 'test';

import mongoose from 'mongoose';
const dbUri = 'mongo/librum-ci-models-test';

beforeEach(done => {
    if (mongoose.connection.readyState === 1) return done();

    mongoose.connect(dbUri, done);
    mongoose.Promise = global.Promise;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
});

afterEach(done => {
    mongoose.connection.db.dropDatabase(() => {
        mongoose.connection.close(done);
    });
});
