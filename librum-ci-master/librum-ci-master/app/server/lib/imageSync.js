import kubeClient from './kubeClient';

const SHARED_REPOS_DIR = '/git-repos';
const _imageSyncPodTemplate = {
    'apiVersion': 'v1',
    'kind': 'Pod',
    'metadata': {
        'namespace': 'librum-ci',
        'labels': {}
    },
    'spec': {
        'restartPolicy': 'Never',
        'containers': [
            {
                'env': [],
                'image': 'toeknee/librum-ci-image-sync:0.01',
                'name': 'image-sync',
                'volumeMounts': [
                    {
                        'mountPath': SHARED_REPOS_DIR,
                        'name': 'git-repos-persistent-storage'
                    },
                    {
                        'mountPath': '/var/run/docker.sock',
                        'name': 'docker-socket',
                        'readOnly': false
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
            },
            {
                'name': 'docker-socket',
                'hostPath': {
                    'path': '/var/run/docker.sock'
                }
            }
        ]
    }
};

const generateSyncPodTemplate = (buildId, repoSlug) => {
    const template = JSON.parse(JSON.stringify(_imageSyncPodTemplate));

    template.metadata.labels.name = `image-sync-${buildId}`;
    template.spec.containers[0]['env'].push({
        'name': 'BUILD_ID',
        'value': buildId
    }, {
        'name': 'REPO_NAME',
        'value': repoSlug
    }, {
        'name': 'REPO_DIR',
        'value': `${SHARED_REPOS_DIR}/${repoSlug}`
    });
    return template;
};

const createSyncImagePod = (buildId, repoSlug) => {
    const template = generateSyncPodTemplate(buildId, repoSlug);

    console.log('Syncing image with template:', template);
    return new Promise((resolve, reject) => {
        kubeClient.pods.create(template, (err, pod) => {
            err ? reject(err) : resolve(pod);
        });
    });
};

export {generateSyncPodTemplate, createSyncImagePod};
