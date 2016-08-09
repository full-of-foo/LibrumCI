import {onPush} from '../../app/hooks/push';
import {Repo, Branch, Build} from 'librum-ci-models';

const mockPushData = require('../support/fixtures/push.json');
const mockRepoData = {slug: 'full-of-foo/sample-libreci-app', dockerRunCommand: 'true'};

describe('Hooks: pushSpec', () => {
    it('should return a promise', done => {
        const promise = onPush(mockPushData);
        promise.then(() => expect(promise.constructor).toBe(Promise))
               .then(done);
    });

    it('should not schedule a build for a non-existing repo', done => {
        onPush(mockPushData)
            .then(() => {
                Repo.count({}, (err, count) => {
                    expect(count).toBe(0);
                    done();
                });
            });
    });

    it('should schedule a build for an existing repo', done => {
        Repo.create(mockRepoData)
            .then(() => {
                return onPush(mockPushData)
                    .then(() => Repo.count({}).exec().then(count => expect(count).toBe(1)))
                    .then(() => Branch.count({}).exec().then(count => expect(count).toBe(1)))
                    .then(() => Build.count({}).exec().then(count => expect(count).toBe(1)));
            }).then(() => done());
    });

    it('should upsert branches and create a build for subsequent pushes', done => {
        Repo.create(mockRepoData)
            .then(() => {
                return onPush(mockPushData)
                    .then(() => onPush(mockPushData))
                    .then(() => Repo.count({}).exec().then(count => expect(count).toBe(1)))
                    .then(() => Branch.count({}).exec().then(count => expect(count).toBe(1)))
                    .then(() => Build.count({}).exec().then(count => expect(count).toBe(2)));
            }).then(() => done());
    });

});
