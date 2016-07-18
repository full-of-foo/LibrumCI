import { Router } from 'express';
import { Build } from 'librum-ci-models';

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

export default router;
