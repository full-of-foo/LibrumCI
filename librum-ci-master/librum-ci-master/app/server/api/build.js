import {Router} from 'express';
import {Build} from 'librum-ci-models';
import mongoose from 'mongoose';
import Promise from 'bluebird';
import {GitSyncPodBuilder, ImageSyncPodBuilder, TestRunnerPodBuilder} from '../lib/podBuilder';
import kubeClient from '../lib/kubeClient';

const router = Router();
const CastError = mongoose.Error.CastError;

const _runPipelinePhase = (PodBuilder, podArgs, phaseName, build) => {
    const phaseMetadata = {state: 'Running'};
    phaseMetadata[phaseName] = {};
    phaseMetadata[phaseName].startedAt = new Date();

    return Build.findOneAndUpdate({_id: build._id}, phaseMetadata, {new: true}).exec()
        .then(() => PodBuilder.createPod(podArgs))
        .then(pod => {
            phaseMetadata[phaseName].podName = pod.metadata.name;
            return Build.findOneAndUpdate({_id: build._id}, phaseMetadata, {new: true}).exec()
                        .then(() => Promise.resolve(pod));
        })
        .then(pod => kubeClient.streamPodUntilPhase(pod))
        .then(pod => {
            return kubeClient.getPodLogs(pod)
                    .then(logs => {
                        phaseMetadata.state = 'Success';
                        phaseMetadata[phaseName].logs = logs;
                        phaseMetadata[phaseName].finishedAt = new Date();
                        return Build.findOneAndUpdate({_id: build._id}, phaseMetadata, {new: true}).exec()
                                    .then(() => Promise.resolve(pod));
                    });
        })
        .then(pod => kubeClient.deletePod(pod));
};

const createAndStreamBuildPipeline = build => {
    const branch = build.branch;
    const repo = branch.repo;
    const sha = build.commits.filter(c => c.isHead)[0].sha;
    const basePodArgs = {buildId:build.buildId, repoSlug:repo.slug};
    const gitPodArgs = Object.assign(basePodArgs, {cloneUrl:repo.cloneUrl, branch:branch.slug, sha:sha});
    const testRunnerArgs = Object.assign(basePodArgs, {runCommand:repo.dockerRunCommand});

    // TODO - speed up build by doing deletes async afterwards
    return _runPipelinePhase(GitSyncPodBuilder, gitPodArgs, 'gitSync', build)
        .then(() => _runPipelinePhase(ImageSyncPodBuilder, basePodArgs, 'imageSync', build))
        .then(() => _runPipelinePhase(TestRunnerPodBuilder, testRunnerArgs, 'testRunner', build));
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
