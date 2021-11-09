import { NextFunction, Request, Response } from 'express';

module.exports = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.tokenPayload.is_admin) {
    res.status(403).send('Access Denied');
  } else {
    next();
  }
};
