import { sign } from "jsonwebtoken";
import { Request } from "express";

export const generateToken = (user: object): string => {
  const token = sign(user, process.env.SEC_HASH as string, { expiresIn: "3d" });
  return token;
};
export function getToken(req: Request) {
  if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
}
