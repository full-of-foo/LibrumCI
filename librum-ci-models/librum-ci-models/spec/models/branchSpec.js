import Branch from '../../lib/models/branch';

describe('Model: Branch', () => {
    it('should be queryable', done => {
        Branch.find((err, branches) => expect(branches).toBeTruthy())
            .then(done);
    });

    it('should be updatable and deletable', done => {
        new Branch({}).save((err, b) => expect(b._id).toBeTruthy())
            .then(() => Branch.findOneAndRemove()
                .then(() => Branch.count((err, count) => expect(count).toEqual(0))
                    .then(done)));
    });
});
