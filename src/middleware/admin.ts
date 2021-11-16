import { NextFunction, Request, Response } from 'express';

const admin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.tokenPayload.is_admin) {
    res.status(403).send('Access Denied');
  } else {
    next();
  }
};

export default admin;
