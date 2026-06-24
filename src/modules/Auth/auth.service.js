import { create, findOne } from "../../DB/database.repository.js";
import jwt from "jsonwebtoken";
import UserModel from "../../DB/Models/users.model.js";
import {
  BadRequestException,
  ConflictException,
} from "../../Utils/response/error.response.js";
import { successResponse } from "../../Utils/response/success.response.js";
import {
  compareHash,
  generateHash,
} from "../../Utils/security/hash.security.js";
import { algorithmEnum } from "../../Utils/enums/algorithm.enum.js";
import {
  decryption,
  encryption,
} from "../../Utils/security/encryption.security.js";

import {
  generateToken,
  getNewloginCredintials,
} from "../../Utils/tokens/tokens.js";
import { OAuth2Client } from "google-auth-library";
import { CLIENT_ID } from "../../Configs/config.service.js";
import { ProviderEnum } from "../../Utils/enums/user.enum.js";
export const signup = async (req, res) => {
  const { firstname, lastname, email, password, phone } = req.body;

  const existemail = await findOne({ model: UserModel, filter: { email } });
  if (existemail) {
    throw ConflictException();
  }

  const hashedpassword = await generateHash({
    plaintext: password,
    algorithm: algorithmEnum.BCRYPT,
  });
  const encryptedphone = await encryption(phone);
  const user = await create({
    model: UserModel,
    data: {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hashedpassword,
      phone: encryptedphone,
    },
  });

  if (!user) {
    throw BadRequestException();
  }

  return successResponse({
    res,
    statuscode: 200,
    message: "created successfully",
    data: { user },
  });
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await findOne({ model: UserModel, filter: { email } });
  if (!user) {
    throw BadRequestException("user not found");
  }

  const ismatch = await compareHash({
    plaintext: password,
    ciphertext: user.password,
    algorithm: algorithmEnum.BCRYPT,
  });
  if (!ismatch) {
    throw BadRequestException("invalid crediintials");
  }

  const tokens = await getNewloginCredintials(user);

  return successResponse({
    res,
    statuscode: 200,
    message: "loggedin successfully",
    data: { tokens },
  });
};

export const refreshToken = async (req, res) => {
  const tokens = await getNewloginCredintials(req.user);

  successResponse({
    res,
    statuscode: 200,
    message: "token refreshed successfully",
    data: { tokens },
  });
};
async function verifywithgoogleaccount({ idToken }) {
  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken,
    audience: CLIENT_ID,
  });

  const payload = ticket.getPayload();
  return payload;
}

export const loginwithgoogle = async (req, res) => {
  const { idToken } = req.body;

  const { email, email_verified, given_name, family_name } =
    await verifywithgoogleaccount({
      idToken,
    });

  if (!email_verified) {
    throw BadRequestException("email not verified");
  }

  const user = await findOne({ model: UserModel, filter: { email } });
  if (user) {
    if (user.provider === ProviderEnum.GOOGLE) {
      const credintials = await getNewloginCredintials(user);
      successResponse({
        res,
        statuscode: 200,
        message: "loggedin successfully",
        data: { credintials },
      });
    }
  }

  const newuser = await create({
    model: UserModel,
    data: {
      firstname: given_name,
      lastname: family_name,
      email: email,
      provider: ProviderEnum.GOOGLE,
    },
  });

  const credintials = await getNewloginCredintials(newuser);
  successResponse({
    res,
    statuscode: 201,
    message: "loggedin successfully",
    data: { credintials },
  });
};
