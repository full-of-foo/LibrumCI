import {Router} from 'express';
import Promise from 'bluebird';
import {Repo} from 'librum-ci-models';
import kubeClient from './../lib/kubeClient';
import buildRouter from './build';
import repoRouter from './repo';
import branchRouter from './branch';

const apiRouter = Router();

apiRouter.get('/', (req, res) => {
    const ghPromise = kubeClient.getServiceByName('librum-ci-githooks');
    const masterPromise = kubeClient.getServiceByName('librum-ci-master');
    const repoCountPromise = Repo.count({}).exec();

    Promise.join(ghPromise, masterPromise, repoCountPromise, (ghService, masterService, count) => {
        res.json({
            githooksHost: ghService.status.loadBalancer.ingress[0],
            masterHost: masterService.status.loadBalancer.ingress[0],
            repoCount: count
        });
    }).catch(err => res.send(err));
});

apiRouter.use('/build', buildRouter);
repoRouter.use('/:repoSlug/branch', branchRouter);
apiRouter.use('/repo', repoRouter);

export default apiRouter;
