import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import {
  ACCESS_TOKEN_ADMIN_KEY,
  ACCESS_TOKEN_ADMIN_EXPIRE_IN,
  ACCESS_TOKEN_USER_EXPIRE_IN,
  ACCESS_TOKEN_USER_KEY,
  REFRESH_TOKEN_ADMIN_KEY,
  REFRESH_TOKEN_USER_KEY,
  REFRESH_TOKEN_ADMIN_EXPIRE_IN,
  REFRESH_TOKEN_USER_EXPIRE_IN,
} from "../../Configs/config.service.js";
import { RoleEnum, signatureEnum } from "../enums/user.enum.js";

export const generateToken = async ({ payload, secretKey, options }) => {
  return jwt.sign(payload, secretKey, options);
};

export const verifyToken = async ({ Token, secretKey }) => {
  return jwt.verify(Token, secretKey);
};

export const getSignature = async ({ signatureLevel = signatureEnum.USER }) => {
  let signature = { accessSignature: "", refreshSignature: "" };

  switch (signatureLevel) {
    case signatureEnum.USER:
      signature.accessSignature = ACCESS_TOKEN_USER_KEY;
      signature.refreshSignature = REFRESH_TOKEN_USER_KEY;
      break;
    case signatureEnum.ADMIN:
      signature.accessSignature = ACCESS_TOKEN_ADMIN_KEY;
      signature.refreshSignature = REFRESH_TOKEN_ADMIN_KEY;
      break;
  }
  return signature;
};

export const getNewloginCredintials = async (user) => {
  const signature = await getSignature({
    signatureLevel:
      user.role != RoleEnum.ADMIN ? signatureEnum.USER : signatureEnum.ADMIN,
  });
  const jwtid = uuidv4();
  const accessToken = await generateToken({
    payload: { id: user._id },
    secretKey: signature.accessSignature,
    options: {
      expiresIn:
        user.role != RoleEnum.ADMIN
          ? ACCESS_TOKEN_USER_EXPIRE_IN
          : ACCESS_TOKEN_ADMIN_EXPIRE_IN,
      jwtid,
    },
  });
  const refreshToken = await generateToken({
    payload: { id: user._id },
    secretKey: signature.refreshSignature,
    options: {
      expiresIn:
        user.role != RoleEnum.ADMIN
          ? REFRESH_TOKEN_USER_EXPIRE_IN
          : REFRESH_TOKEN_ADMIN_EXPIRE_IN,
      jwtid,
    },
  });

  return { accessToken, refreshToken };
};
