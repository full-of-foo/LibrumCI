import kubeClient from './kubeClient';

const SHARED_REPOS_DIR = '/git-repos';
const _gitSyncPodTemplate = {
    'apiVersion': 'v1',
    'kind': 'Pod',
    'metadata': {},
    'spec': {
        'restartPolicy': 'OnFailure',
        'containers': [
            {
                'env': [
                    {
                        'name': 'GIT_SYNC_ONE_TIME',
                        'value': 'true'
                    },
                    {
                        'name': 'GIT_SYNC_DEPTH',
                        'value': '1'
                    }
                ],
                'image': 'toeknee/git-sync:0.01',
                'name': 'git-sync',
                'volumeMounts': [
                    {
                        'mountPath': SHARED_REPOS_DIR,
                        'name': 'git-repos-persistent-storage'
                    }
                ]
            }
        ],
        'volumes': [
            {
                'name': 'git-repos-persistent-storage',
                'gcePersistentDisk': {
                    'pdName': 'git-repos-disk',
                    'fsType': 'ext4'
                }
            }
        ]
    }
};

const generateSyncPodTemplate = (buildId, repoSlug, cloneUrl, branch, rev) => {
    const template = JSON.parse(JSON.stringify(_gitSyncPodTemplate));

    template.metadata.name = `git-sync-${buildId}`;
    template.spec.containers[0]['env'].push({
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
        'value': rev
    });
    return template;
};

const createSyncRepoPod = (buildId, repoSlug, cloneUrl, branch, rev) => {
    const template = generateSyncPodTemplate(buildId, repoSlug, cloneUrl, branch, rev);

    console.log('Syncing repo with template:', template);
    return new Promise((resolve, reject) => {
        kubeClient.pods.create(template, (err, pod) => {
            err ? reject(err) : resolve(pod);
        });
    });
};

export {generateSyncPodTemplate, createSyncRepoPod};
