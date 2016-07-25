import {Router} from 'express';
import {Build} from 'librum-ci-models';
import {createSyncRepoPod, createSyncImagePod} from '../lib/repoSync';

const router = Router();

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
                createSyncRepoPod(build._id, repo.slug, repo.cloneUrl, branch.slug, headCommitSha)
                    .then(repoSyncPod => {
                        console.log('Repo sync pod created:', repoSyncPod);

                        // TODO - don't block, listen/stream
                        setTimeout(() => {
                            createSyncImagePod(build._id, repo.slug)
                                .then(imageSyncPod => {
                                    console.log('Image sync pod created:', imageSyncPod);
                                    res.json({'pods': [repoSyncPod, imageSyncPod]});
                                })
                                .catch(imageSyncErr => res.send(imageSyncErr));
                        }, 9000);
                    })
                    .catch(repoSyncErr => res.send(repoSyncErr));
            });
    });

export default router;
