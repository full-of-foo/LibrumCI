import Repo from '../../lib/models/repo';

describe('Model: Repo', () => {
    it('should be queryable', done => {
        Repo.find((err, repos) => expect(repos).toBeTruthy())
            .then(done);
    });

    it('should be updatable and deletable', done => {
        new Repo({}).save((err, r) => expect(r._id).toBeTruthy())
            .then(() => Repo.findOneAndRemove()
                .then(() => Repo.count((err, count) => expect(count).toEqual(0))
                    .then(done)));
    });
});
