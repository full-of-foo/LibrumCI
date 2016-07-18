import { Router } from 'express';
import buildRouter from './build';
import repoRouter from './repo';
import branchRouter from './branch';

const apiRouter = Router();

apiRouter.get('/', (req, res) => res.json({version : '1.0'}));
apiRouter.use('/build', buildRouter);
repoRouter.use('/:repoSlug/branch', branchRouter);
apiRouter.use('/repo', repoRouter);

export default apiRouter;
