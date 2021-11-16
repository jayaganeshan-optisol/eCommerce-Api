import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = verify(token, process.env.SEC_HASH as string) as object;
    req.body.tokenPayload = decoded;
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
};
export default auth;
