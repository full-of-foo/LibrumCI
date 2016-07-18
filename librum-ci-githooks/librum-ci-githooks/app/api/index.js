import { Router } from 'express';

const apiRouter = Router();

apiRouter.get('/', (req, res) => res.json({version: '1.0'}));

export default apiRouter;
