import {Router} from 'express';
import {Build} from 'librum-ci-models';
import mongoose from 'mongoose';
import createBuildPipeline from './../lib/buildPipeline';

const router = Router();
const CastError = mongoose.Error.CastError;

router.route('/')
    .get((req, res) => {
        Build.find({}).sort('-createdAt').exec()
            .then(builds => res.json(builds))
            .error(err => res.status(500).send(err));
    });
router.route('/:id')
    .get((req, res) => {
        Build.findOne({_id: req.params.id})
            .populate({path:'branch', populate:{path:'repo'}}).exec()
            .catch(CastError, err => res.status(404).send(err))
            .then(build => build ? res.json(build): res.status(404).send({}))
            .error(err => res.status(500).send(err));
    });
router.route('/:id/schedule')
    .get((req, res) => {
        Build.findOne({_id: req.params.id})
            .populate({path:'branch', populate:{path:'repo'}}).exec()
            .catch(CastError, err => res.status(404).send(err))
            .then(build => {
                if (!build) res.status(404).send({});

                createBuildPipeline(build)
                    .then(data => res.json(data))
                    .catch(err => res.send(err))
                    .error(err => console.error('Pipeline error:', err));
            })
            .error(err => res.status(500).send(err));
    });

export default router;
