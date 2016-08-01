import {Router} from 'express';
import {Build} from 'librum-ci-models';
import {createSyncRepoPod} from '../lib/repoSync';
import {createSyncImagePod} from '../lib/imageSync';
import kubeClient from '../lib/kubeClient';

const router = Router();

const createAndStreamBuildPipeline = (buildId, repoSlug, cloneUrl, branchSlug, sha, errorCb, successCb) => {
    return createSyncRepoPod(buildId, repoSlug, cloneUrl, branchSlug, sha)
        .then(repoSyncPod => {
            kubeClient.streamPod(repoSyncPod.metadata.labels.name, errorCb,
                                (data => {
                                    createSyncImagePod(buildId, repoSlug)
                                        .then(imageSyncPod => {
                                            kubeClient.streamPod(imageSyncPod.metadata.labels.name,
                                                                 errorCb, successCb);
                                        })
                                        .catch(errorCb);
                                }));
        }).catch(errorCb);
};

router.route('/')
    .get((req, res) => {
        Build.find({}, (err, builds) => {
            if (err) res.send(err);
            res.json(builds);
        });
    });
router.route('/:buildId')
    .get((req, res) => {
        Build.findById(req.params.buildId, (err, build) => {
            if (err) res.send(err);
            res.json(build);
        });
    });
router.route('/:buildId/schedule')
    .get((req, res) => {
        Build.findById(req.params.buildId)
            .populate({
                path: 'branch',
                populate: {
                    path: 'repo',
                }
            }).exec((err, build) => {
                if (err) res.send(err);

                const branch = build.branch;
                const repo = branch.repo;
                const headCommitSha = build.commits.filter(c => c.isHead)[0].sha;
                createAndStreamBuildPipeline(build._id, repo.slug, repo.cloneUrl, branch.slug, headCommitSha,
                                             (buildErr => res.send(buildErr)),
                                             (imageSyncPod => res.json(imageSyncPod)));
            });
    });

export default router;
