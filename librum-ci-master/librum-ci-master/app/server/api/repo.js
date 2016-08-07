import { Router } from 'express';
import { Repo, Branch, Build } from 'librum-ci-models';
import mongoose from 'mongoose';

const router = Router();
const ValidationError = mongoose.Error.ValidationError;
const CastError = mongoose.Error.CastError;

router.route('/')
    .get((req, res) => {
        Repo.find({}).exec()
            .then(repos => res.json(repos))
            .error(err => res.status(500).send(err));
    })
    .post((req, res) => {
        Repo.create(req.body)
            .then(repo => res.status(201).json(repo))
            .catch(ValidationError, err => res.status(422).send(err))
            .error(err => res.status(500).send(err));
    });
router.route('/:id')
    .get((req, res) => {
        Repo.findOne({_id: req.params.id}).exec()
            .catch(CastError, err => res.status(404).send(err))
            .then(repo => {
                if (!repo) res.status(404).send({});
                if (req.query.isFull !== '1') res.json(repo);

                Branch.find({repo: repo._id}).exec()
                    .then(branches => {
                        Build.find({branch: {$in: branches.map(b => b._id)}})
                            .populate('branch').exec()
                            .then(builds => res.json(Object.assign(repo.toJSON(), {builds: builds})));
                    })
                    .error(err => res.status(500).send(err));
            })
            .error(err => res.status(500).send(err));
    })
    .put((req, res) => {
        if (req.body.slug) delete req.body.slug;
        Repo.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}).exec()
            .catch(CastError, err => res.status(404).send(err))
            .catch(ValidationError, err => res.status(422).send(err))
            .then(repo => repo ? res.json(repo): res.status(404).send({}))
            .error(err => res.status(500).send(err));
    });

export default router;
