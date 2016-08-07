import Repo from '../../lib/models/repo';

const data = {
    slug: 'Started',
    dockerRunCommand: 'echo pew'
};

describe('Model: Repo', () => {
    it('should be queryable', done => {
        Repo.find((err, repos) => expect(repos).toBeTruthy())
            .then(done);
    });

    it('should have required fields', done => {
        new Repo({}).save((err, b) => {
            expect(err).toBeTruthy();
            expect(err.name).toBe('ValidationError');
            done();
        });
    });

    it('should be updatable and deletable', done => {
        new Repo(data).save((err, r) => expect(r._id).toBeTruthy())
            .then(() => Repo.findOneAndRemove()
                .then(() => Repo.count((err, count) => expect(count).toEqual(0))
                    .then(done)));
    });
});
