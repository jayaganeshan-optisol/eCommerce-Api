import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { DecodedToken, getToken, verifyToken } from "../services/tokenHandling";

const auth = (roles: any) => {
  return [
    // authorize based on user role
    (req: Request, res: Response, next: NextFunction) => {
      const token: any = getToken(req);
      if (!token) return res.status(400).send({ error: "NO token Provided" });
      console.log(token);
      const decode: any = verifyToken(token);
      if (roles.length && !roles.includes(decode.role)) {
        // user's role is not authorized
        return res.status(401).json({ error: "Unauthorized" });
      }
      req.body.tokenPayload = decode;
      next();
    },
  ];
};

export default auth;
