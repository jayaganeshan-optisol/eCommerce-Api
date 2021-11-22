import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { getToken } from "../services/generateToken";

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = getToken(req);
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = verify(token, process.env.SEC_HASH as string) as object;
    req.body.tokenPayload = decoded;
    next();
  } catch (ex) {
    res.status(401).send("Invalid token.");
  }
};
export default auth;
