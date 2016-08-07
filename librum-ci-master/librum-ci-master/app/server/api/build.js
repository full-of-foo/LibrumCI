import {Router} from 'express';
import {Build} from 'librum-ci-models';
import mongoose from 'mongoose';
import Promise from 'bluebird';
import {GitSyncPodBuilder, ImageSyncPodBuilder, TestRunnerPodBuilder} from '../lib/podBuilder';
import kubeClient from '../lib/kubeClient';

const router = Router();
const CastError = mongoose.Error.CastError;

const createAndStreamBuildPipeline = build => {
    const branch = build.branch;
    const repo = branch.repo;
    const sha = build.commits.filter(c => c.isHead)[0].sha;
    const basePodArgs = {buildId:build.buildId, repoSlug:repo.slug};
    const gitPodArgs = Object.assign(basePodArgs, {cloneUrl:repo.cloneUrl, branch:branch.slug, sha:sha});
    const testRunnerArgs = Object.assign(basePodArgs, {runCommand:repo.dockerRunCommand});

    // TODO - speed up build by doing deletes async afterwards
    return GitSyncPodBuilder.createPod(gitPodArgs)
        .then(gsp => kubeClient.streamPodUntilPhase(gsp))
        .then(gsp => {
            return Build.upsert({_id: build.buildId}, {gitSync:{podName:gsp.metadata.name}})
                        .then(() => Promise.resolve(gsp));
        })
        .then(gsp => kubeClient.deletePod(gsp))
        .then(() => ImageSyncPodBuilder.createPod(basePodArgs))
        .then(isp => kubeClient.streamPodUntilPhase(isp))
        .then(isp => {
            return Build.upsert({_id: build.buildId}, {imageSync:{podName:isp.metadata.name}})
                .then(() => Promise.resolve(isp));
        })
        .then(isp => kubeClient.deletePod(isp))
        .then(() => TestRunnerPodBuilder.createPod(testRunnerArgs))
        .then(trp => kubeClient.streamPodUntilPhase(trp))
        .then(trp => {
            return Build.upsert({_id: build.buildId}, {testRunner:{podName:trp.metadata.name}})
                .then(() => Promise.resolve(trp));
        })
        .then(trp => kubeClient.deletePod(trp));
};

router.route('/')
    .get((req, res) => {
        Build.find({}).exec()
            .then(builds => res.json(builds))
            .error(err => res.status(500).send(err));
    });
router.route('/:id')
    .get((req, res) => {
        Build.findOne({_id: req.params.id})
            .populate({path:'branch', populate:{path:'repo'}}).exec()
            .catch(CastError, err => res.status(404).send(err))
            .then(repo => repo ? res.json(repo): res.status(404).send({}))
            .error(err => res.status(500).send(err));
    });
router.route('/:id/schedule')
    .get((req, res) => {
        Build.findOne({_id: req.params.id})
            .populate({path:'branch', populate:{path:'repo'}}).exec()
            .catch(CastError, err => res.status(404).send(err))
            .then(build => {
                if (!build) res.status(404).send({});

                createAndStreamBuildPipeline(build)
                    .then(data => res.json(data))
                    .catch(err => res.send(err))
                    .error(err => console.error('Pipeline error:', err));
            })
            .error(err => res.status(500).send(err));
    });

export default router;
