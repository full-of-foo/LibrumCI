import {GitSyncPodBuilder,
        ImageSyncPodBuilder,
        TestRunnerPodBuilder} from '../../../app/server/lib/podBuilder';

const basePodArgs = {
    buildId: '1234',
    repoSlug: 'foo/bar',
};

const gitSyncPodArgs = Object.assign({
    cloneUrl: 'http://gh.com/foo/bar',
    branch: 'master',
    sha: 'abc1234'
}, basePodArgs);

const testRunnerPodArgs = Object.assign({
    runCommand: 'echo pew',
    envVars: [{key: 'AWS_KEY', value: 'ROFL_MASTER'}]
}, basePodArgs);

describe('Lib: podBuilder', () => {
    it('should be able to _generatePodSpec for GitSyncPodBuilder', () => {
        const t = GitSyncPodBuilder._generatePodSpec(gitSyncPodArgs);

        expect(t.metadata.labels.name).toContain('git-sync-');
        expect(t.metadata.labels.build).toBe(gitSyncPodArgs.buildId);
        expect(t.spec.containers[0]['env'][2].value).toBe('http://gh.com/foo/bar');
        expect(t.spec.containers[0]['env'][3].value).toBe('/git-repos/foo/bar');
        expect(t.spec.containers[0]['env'][4].value).toBe('master');
        expect(t.spec.containers[0]['env'][5].value).toBe('abc1234');
    });

    it('should be able to _generatePodSpec for ImageSyncPodBuilder', () => {
        process.env.DOCKER_HUB_USER = 'mockuser';
        const t = ImageSyncPodBuilder._generatePodSpec(basePodArgs);

        expect(t.metadata.labels.name).toContain('image-sync-');
        expect(t.metadata.labels.build).toBe(basePodArgs.buildId);
        expect(t.spec.containers[0]['env'][2].value).toBe('mockuser/librum-ci-build-foo-bar:1234');
        expect(t.spec.containers[0]['env'][3].value).toBe('/git-repos/foo/bar');
    });

    it('should be able to _generatePodSpec for TestRunnerPodBuilder', () => {
        process.env.DOCKER_HUB_USER = 'mockuser';
        const t = TestRunnerPodBuilder._generatePodSpec(testRunnerPodArgs);

        expect(t.metadata.labels.name).toContain('test-runner-');
        expect(t.metadata.labels.build).toBe(basePodArgs.buildId);
        expect(t.spec.containers[0].image).toBe('mockuser/librum-ci-build-foo-bar:1234');
        expect(t.spec.containers[0].command[0]).toBe('echo');
        expect(t.spec.containers[0].command[1]).toBe('pew');
        expect(t.spec.containers[0]['env'][0].name).toBe(testRunnerPodArgs.envVars[0].key);
        expect(t.spec.containers[0]['env'][0].value).toBe(testRunnerPodArgs.envVars[0].value);
    });
});
