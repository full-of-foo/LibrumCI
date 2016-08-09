import {Build} from 'librum-ci-models';
import {GitSyncPodBuilder, ImageSyncPodBuilder, TestRunnerPodBuilder} from '../lib/podBuilder';
import kubeClient from '../lib/kubeClient';

const _endPipelinePhase = (phaseName, phasePod, build, phaseMetadata, onState = 'Success') => {
    return kubeClient.getPodLogs(phasePod)
        .then(logs => {
            const updatedMetaData = {logs: logs, finishedAt: new Date()};
            phaseMetadata.state = onState;
            phaseMetadata[phaseName] = Object.assign(phaseMetadata[phaseName], updatedMetaData);
            return Build.findOneAndUpdate({_id: build._id}, phaseMetadata, {new: true}).exec()
                        .then(() => kubeClient.deletePod(phasePod));
        });
};

const _runPipelinePhase = (PodBuilder, podArgs, phaseName, build) => {
    const phaseMetadata = {state: 'Running'};
    phaseMetadata[phaseName] = {};
    phaseMetadata[phaseName].startedAt = new Date();

    return Build.findOneAndUpdate({_id: build._id}, phaseMetadata, {new: true}).exec()
        .then(() => PodBuilder.createPod(podArgs))
        .then(pod => {
            phaseMetadata[phaseName].podName = pod.metadata.name;
            return Build.findOneAndUpdate({_id: build._id}, phaseMetadata, {new: true}).exec()
                        .return(pod);
        })
        .then(pod => kubeClient.streamPodUntilPhase(pod))
        .catch({name: 'PodStreamError'}, e => _endPipelinePhase(phaseName, e.pod, build, phaseMetadata, 'Failed'))
        .then(pod => _endPipelinePhase(phaseName, pod, build, phaseMetadata, 'Success'));
};

const createBuildPipeline = build => {
    const branch = build.branch;
    const repo = branch.repo;
    const sha = build.commits.filter(c => c.isHead)[0].sha;
    const basePodArgs = {buildId:build._id, repoSlug:repo.slug};
    const gitPodArgs = Object.assign(basePodArgs, {cloneUrl:repo.cloneUrl, branch:branch.slug, sha:sha});
    const testRunnerArgs = Object.assign(basePodArgs, {runCommand:repo.dockerRunCommand, envVars:repo.envVars});

    return _runPipelinePhase(GitSyncPodBuilder, gitPodArgs, 'gitSync', build)
        .then(() => _runPipelinePhase(ImageSyncPodBuilder, basePodArgs, 'imageSync', build))
        .then(() => _runPipelinePhase(TestRunnerPodBuilder, testRunnerArgs, 'testRunner', build));
};

export default createBuildPipeline;
