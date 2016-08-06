process.env.NODE_ENV = 'test';

import mongoose from 'mongoose';
import Promise from 'bluebird';
import config from '../config';

mongoose.Promise = Promise;

beforeEach(done => {
    if (mongoose.connection.readyState === 1) return done();

    mongoose.connect(config.dbUri, done);
    mongoose.Promise = global.Promise;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
});

afterEach(done => {
    mongoose.connection.db.dropDatabase(() => {
        mongoose.connection.close(done);
    });
});
