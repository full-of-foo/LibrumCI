import { Router } from 'express';
import { Repo } from 'librum-ci-models';

const router = Router();

router.route('/')
    .get((req, res) => {
        Repo.find({}, (err, repos) => {
            if (err) res.send(err);
            res.json(repos);
        });
    });
router.route('/:repoSlug')
    .get((req, res) => {
        Repo.find({slug: req.params.repoSlug}, (err, repos) => {
            if (err) res.send(err);

            if (repos.length > 1) {
                res.status(500);
                res.json({'error': `More than one repo found for: ${req.params.repoSlug}`});
            } else if (repos.length === 1) {
                res.json(repos[0]);
            } else {
                res.status(404);
                res.json({});
            }
        });
    });

export default router;
