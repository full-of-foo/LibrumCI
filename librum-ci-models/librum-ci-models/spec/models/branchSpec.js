import mongoose from 'mongoose';
import Branch from '../../lib/models/branch';

const data = {
    slug: 'refs/hehe',
    repo: new mongoose.Types.ObjectId()
};

describe('Model: Branch', () => {
    it('should be queryable', done => {
        Branch.find((err, branches) => expect(branches).toBeTruthy())
            .then(done);
    });

    it('should have required fields', done => {
        new Branch({}).save((err, b) => {
            expect(err).toBeTruthy();
            expect(err.name).toBe('ValidationError');
            done();
        });
    });

    it('should be updatable and deletable', done => {
        new Branch(data).save((err, b) => expect(b._id).toBeTruthy())
            .then(() => Branch.findOneAndRemove()
                .then(() => Branch.count((err, count) => expect(count).toEqual(0))
                    .then(done)));
    });
});
