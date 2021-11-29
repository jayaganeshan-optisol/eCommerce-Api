import config from "config";
import { AES, enc } from "crypto-js";

export const hashPassword = (password: string) => {
  const hashValue = AES.encrypt(password, config.get("PASS_HASH") as string).toString();
  return hashValue;
};
export const comparePassword = (hashValue: string, password: string) => {
  const decrypt = AES.decrypt(hashValue, config.get("PASS_HASH") as string).toString(enc.Utf8);
  if (decrypt === password) {
    return true;
  } else {
    return false;
  }
};
