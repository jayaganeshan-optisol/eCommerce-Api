import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

const error = async (err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send('Something failed');
};

export default error;
