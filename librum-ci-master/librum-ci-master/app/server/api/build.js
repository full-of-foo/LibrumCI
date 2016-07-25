import {Router} from 'express';
import {Build} from 'librum-ci-models';
import {createSyncRepoPod} from '../lib/repoSync';

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
                    .then(pod => res.json(pod))
                    .catch(err => res.send(err));
            });
    });

export default router;
