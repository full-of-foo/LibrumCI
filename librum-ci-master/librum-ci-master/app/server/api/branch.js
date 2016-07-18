import { Router } from 'express';
import { Branch } from 'librum-ci-models';

const router = Router({mergeParams: true});

router.route('/')
    .get((req, res) => {
        Branch.find({repoSlug: req.params.repoSlug}, (err, branches) => {
            if (err) res.send(err);
            res.json(branches);
        });
    });
router.route('/:branchSlug')
    .get((req, res) => {
        Branch.find({repoSlug: req.params.repoSlug,
                     branchSlug: req.params.branchSlug}, (err, branches) => {
            if (err) res.send(err);

            if (branches.length > 1) {
                res.status(500);
                res.json({'error': `More than one branch found for: ${req.params.branchSlug}`});
            } else if (branches.length === 1) {
                res.json(branches[0]);
            } else {
                res.status(404);
                res.json({});
            }
        });
    });

export default router;
