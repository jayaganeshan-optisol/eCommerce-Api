import { Router, Request, Response } from 'express';

export const router: Router = Router();

router.post('/cart', (req: Request, res: Response) => {
  res.send('success');
});
