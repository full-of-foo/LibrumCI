import mongoose from 'mongoose';
import Build from '../../lib/models/build';

const data = {
    state: 'Started',
    compareUrl: 'lol.com',
    branchId: new mongoose.Types.ObjectId()
};

describe('Model: Build', () => {
    it('should be queryable', done => {
        Build.find((err, builds) => expect(builds).toBeTruthy())
            .then(done);
    });

    it('should have required fields', done => {
        new Build({}).save((err, b) => {
            expect(err).toBeTruthy();
            expect(err.name).toBe('ValidationError');
            done();
        });
    });

    it('should be updatable and deletable', done => {
        new Build(data).save((err, b) => expect(b._id).toBeTruthy())
            .then(() => Build.findOneAndRemove()
                .then(() => Build.count((err, count) => expect(count).toEqual(0))
                    .then(done)));
    });
});
