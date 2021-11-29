import { sign, verify } from "jsonwebtoken";
import { Request } from "express";
import { AccountType } from "../models/User";
import config from "config";
export interface DecodedToken {
  user_id: string;
  role: AccountType;
  iat: string;
  exp: string;
}
export const generateToken = (user: object): string => {
  const token = sign(user, config.get("SEC_HASH") as string, { expiresIn: "3d" });
  return token;
};
export function getToken(req: Request) {
  if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
}

export const verifyToken = (token: string) => {
  const decoded = verify(token, config.get("SEC_HASH") as string);
  if (decoded) return decoded;
  return null;
};
