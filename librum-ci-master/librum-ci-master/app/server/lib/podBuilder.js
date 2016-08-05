import crypto from 'crypto';
import Promise from 'bluebird';
import kubeClient from './kubeClient';

const SHARED_REPOS_DIR = '/git-repos';
const gitSyncTemplate = require('./podTemplates/git-sync.json');
const imageSyncTemplate = require('./podTemplates/image-sync.json');

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
        const templ = JSON.parse(JSON.stringify(gitSyncTemplate));
        const uid = crypto.randomBytes(20).toString('hex');
        let {buildId, repoSlug, cloneUrl, branch, sha} = args;
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
        const templ = JSON.parse(JSON.stringify(imageSyncTemplate));
        const uid = crypto.randomBytes(20).toString('hex');

        templ.metadata.labels.name = `image-sync-${uid}`;
        templ.metadata.labels.build = args.buildId;
        templ.spec.containers[0].env.push({
            'name': 'BUILD_ID',
            'value': args.buildId
        }, {
            'name': 'REPO_NAME',
            'value': args.repoSlug
        }, {
            'name': 'REPO_DIR',
            'value': `${SHARED_REPOS_DIR}/${args.repoSlug}`
        });
        return templ;
    }
}

export {GitSyncPodBuilder, ImageSyncPodBuilder};
