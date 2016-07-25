import {generateSyncPodTemplate, createSyncRepoPod} from '../../../app/server/lib/repoSync';

const templateArgs = ['1234', 'foo/bar', 'http://gh.com/foo/bar',
                      'master', 'abc1234'];

describe('Lib: repoSync', () => {
    it('should be able to generateSyncPodTemplate', () => {
        const t = generateSyncPodTemplate(...templateArgs);

        expect(t.metadata.name).toBe('git-sync-1234');
        expect(t.spec.containers[0]['env'][2].value).toBe('http://gh.com/foo/bar');
        expect(t.spec.containers[0]['env'][3].value).toBe('/git-repos/foo/bar');
        expect(t.spec.containers[0]['env'][4].value).toBe('master');
        expect(t.spec.containers[0]['env'][5].value).toBe('abc1234');
    });

    it('should be able to createSyncRepoPod', () => {
        const res = createSyncRepoPod(...templateArgs);
        expect(res.constructor).toBe(Promise);
    });
});
