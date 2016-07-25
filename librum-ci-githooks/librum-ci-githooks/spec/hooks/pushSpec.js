import {onPush} from '../../app/hooks/push';
import {Repo, Branch, Build} from 'librum-ci-models';

const mockPushData = require('../support/fixtures/push.json');

describe('Hooks: pushSpec', () => {
    it('should return a promise', done => {
        const promise = onPush(mockPushData);
        promise.then(() => expect(promise.constructor).toBe(Promise))
               .then(done);
    });

    it('should create a new repo, branch and build', done => {
        onPush(mockPushData)
            .then(() => {
                Repo.count({}, (err, count) => {
                    console.log('Repo', count);
                    expect(count).toBeGreaterThan(0);
                    Branch.count({}, (err2, count2) => {
                        console.log('Branch', count2);
                        Build.count({}, (err3, count3) => {
                            console.log('Build', count3);
                            expect(count3).toBeGreaterThan(0);
                            done();
                        });
                    });
                });
            });
    });
});
