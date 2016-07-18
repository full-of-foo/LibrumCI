import Build from '../../lib/models/build';

describe('Model: Build', () => {
    it('should be queryable', done => {
        Build.find((err, builds) => expect(builds).toBeTruthy())
            .then(done);
    });

    it('should be updatable and deletable', done => {
        new Build({}).save((err, b) => expect(b._id).toBeTruthy())
            .then(() => Build.findOneAndRemove()
                .then(() => Build.count((err, count) => expect(count).toEqual(0))
                    .then(done)));
    });
});
