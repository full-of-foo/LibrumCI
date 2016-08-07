import crypto from 'crypto';
import Promise from 'bluebird';
import kubeClient from './kubeClient';

const SHARED_REPOS_DIR = '/git-repos';
const gitSyncTemplate = require('./podTemplates/git-sync.json');
const imageSyncTemplate = require('./podTemplates/image-sync.json');
const testRunnerTemplate = require('./podTemplates/test-runner.json');

class PodBuilder {
    static createPod(args) {
        const template = this._generatePodSpec(args);
        console.log('Creating pod with template:', template);
        return new Promise((resolve, reject) => {
            kubeClient.pods.create(template, (err, pod) => {
                err ? reject(err) : resolve(pod);
            });
        });
    }
}

class GitSyncPodBuilder extends PodBuilder {
    static _generatePodSpec(args) {
        let {buildId, repoSlug, cloneUrl, branch, sha} = args;
        const templ = JSON.parse(JSON.stringify(gitSyncTemplate));
        const uid = crypto.randomBytes(20).toString('hex');
        branch = branch.startsWith('refs/heads/') ? branch.split('refs/heads/')[1] : branch;

        templ.metadata.labels.name = `git-sync-${uid}`;
        templ.metadata.labels.build = buildId;
        templ.spec.containers[0]['env'].push({
            'name': 'GIT_SYNC_REPO',
            'value': cloneUrl
        }, {
            'name': 'GIT_SYNC_DEST',
            'value': `${SHARED_REPOS_DIR}/${repoSlug}`
        }, {
            'name': 'GIT_SYNC_BRANCH',
            'value': branch
        }, {
            'name': 'GIT_SYNC_REV',
            'value': sha
        });
        return templ;
    }
}

class ImageSyncPodBuilder extends PodBuilder {
    static _generatePodSpec(args) {
        const {buildId, repoSlug} = args;
        const templ = JSON.parse(JSON.stringify(imageSyncTemplate));
        const uid = crypto.randomBytes(20).toString('hex');
        const user = process.env.DOCKER_HUB_USER;
        const safeRepoSlug = repoSlug.replace(/\//g, '-');
        const fullBuildName = `${user}/librum-ci-build-${safeRepoSlug}:${buildId}`;

        templ.metadata.labels.name = `image-sync-${uid}`;
        templ.metadata.labels.build = buildId;
        templ.spec.containers[0].env.push({
            'name': 'FULL_BUILD_NAME',
            'value': fullBuildName
        }, {
            'name': 'REPO_DIR',
            'value': `${SHARED_REPOS_DIR}/${repoSlug}`
        });
        return templ;
    }
}

class TestRunnerPodBuilder extends PodBuilder {
    static _generatePodSpec(args) {
        const {buildId, repoSlug, runCommand} = args;
        const templ = JSON.parse(JSON.stringify(testRunnerTemplate));
        const uid = crypto.randomBytes(20).toString('hex');
        const user = process.env.DOCKER_HUB_USER;
        const safeRepoSlug = repoSlug.replace(/\//g, '-');
        const fullBuildName = `${user}/librum-ci-build-${safeRepoSlug}:${buildId}`;

        templ.metadata.labels.name = `test-runner-${uid}`;
        templ.metadata.labels.build = args.buildId;
        templ.spec.containers[0].image = fullBuildName;
        templ.spec.containers[0].command = runCommand.split(' ');
        return templ;
    }
}

export {GitSyncPodBuilder, ImageSyncPodBuilder, TestRunnerPodBuilder};
