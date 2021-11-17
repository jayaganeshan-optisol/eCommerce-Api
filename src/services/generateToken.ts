import { sign } from 'jsonwebtoken';

export const generateToken = (user: object): string => {
  const token = sign(user, process.env.SEC_HASH as string, { expiresIn: '3d' });
  return token;
};
