import {Router} from 'express';
import {Build} from 'librum-ci-models';
import {GitSyncPodBuilder, ImageSyncPodBuilder} from '../lib/podBuilder';
import kubeClient from '../lib/kubeClient';

const router = Router();

const createAndStreamBuildPipeline = (buildId, repoSlug, cloneUrl, branchSlug, sha) => {
    const imagePodArgs = {buildId:buildId, repoSlug:repoSlug};
    const gitPodArgs = Object.assign(imagePodArgs, {cloneUrl:cloneUrl, branch:branchSlug, sha:sha});

    // TODO - speed up build by doing deletes async afterwards
    return GitSyncPodBuilder.createPod(gitPodArgs)
        .then(repoSyncPod => kubeClient.streamPodUntilPhase(repoSyncPod))
        .then(streamedRepoPod => kubeClient.deletePod(streamedRepoPod))
        .then(() => {
            return ImageSyncPodBuilder.createPod(imagePodArgs)
                    .then(imageSyncPod => kubeClient.streamPodUntilPhase(imageSyncPod))
                    .then(streamedImagedPod => kubeClient.deletePod(streamedImagedPod));
        });
};

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
                createAndStreamBuildPipeline(build._id, repo.slug, repo.cloneUrl, branch.slug, headCommitSha)
                    .then(data => res.json(data))
                    .error(err2 => console.error('Pipeline error:', err2))
                    .catch(err3 => res.send(err3));
            });
    });

export default router;
