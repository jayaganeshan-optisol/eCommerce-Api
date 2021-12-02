import { Token } from "../models/Token";
import crypto from "crypto";

export const createToken = async (user_id: number) => {
  const token = crypto.randomBytes(32).toString("hex");
  const result = await Token.create({ user_id, token });
  return result;
};

export const getToken = async (user_id: number, token: string) => {
  const result = await Token.findOne({ where: { user_id, token } });
  return result;
};
