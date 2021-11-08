import { Request, Response } from 'express';

module.exports = (req: Request, res: Response) => {
  if (!req.body.token.isAdmin) res.send('Access Denied');
};
