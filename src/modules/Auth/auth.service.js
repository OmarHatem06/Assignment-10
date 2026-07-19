import {
  create,
  find,
  findOne,
  findByIdAndUpdate,
  updateOne,
  findOneAndUpdate,
} from "../../DB/database.repository.js";
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

import { generateToken, getNewCredintials } from "../../Utils/tokens/tokens.js";
import { OAuth2Client } from "google-auth-library";
import { CLIENT_ID, USEREMAIL } from "../../Configs/config.service.js";
import {
  CredintialEnm,
  GenderEnum,
  LogoutEnum,
  ProviderEnum,
  RoleEnum,
} from "../../Utils/enums/user.enum.js";
import { signupSchema } from "./auth.validation.js";
import TokensModel from "../../DB/Models/tokens.model.js";

import { sendEmail } from "../../Utils/emails/email.utils.js";
import { stringify } from "uuid";
import { generateOtp } from "../../Utils/OTP/OTP.js";
import { generateOtpTemplate } from "../../Utils/emails/HTMLtemplate.js";
import { sendEmailEvent } from "../../Utils/Events/sendEmail.event.js";

export const signup = async (req, res) => {
  const { firstname, lastname, email, password, phone } = req.body;

  const existemail = await findOne({ model: UserModel, filter: { email } });
  if (existemail) {
    throw ConflictException("user already exists");
  }
  const OTP = await generateOtp();
  console.log(OTP);
  const hashedOTP = await generateHash({
    plaintext: OTP,
    algorithm: algorithmEnum.BCRYPT,
  });
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
      confirmemailOTP: hashedOTP,
    },
  });

  sendEmailEvent.emit("confirmEmail", {
    firstname: firstname,
    to: email,
    otp: OTP,
    subject: "Confirm Email OTP",
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

export const confirmEmail = async (req, res) => {
  const { email, otp } = req.body;

  const user = await findOne({
    model: UserModel,
    filter: {
      email: email,
      confirmemailOTP: { $exists: true },
      confirmemail: { $exists: false },
    },
  });
  const result = await compareHash({
    plaintext: otp,
    ciphertext: user.confirmemailOTP,
    algorithm: algorithmEnum.BCRYPT,
  });

  if (!result) {
    throw BadRequestException({ res, message: "invalid OTP", statuscode: 401 });
  }

  await updateOne({
    model: UserModel,
    filter: { email },
    update: {
      confirmemail: Date.now(),
      $unset: {
        confirmemailOTP: false,
      },
    },
  });
  successResponse({ res, message: "Email Confirmed", statuscode: 200 });
};

export const resendConfirmEmailOTP = async (req, res) => {
  const { email } = req.body;
  const newOTP = await generateOtp();
  console.log(newOTP);
  const hashedOTP = await generateHash({
    plaintext: newOTP,
    algorithm: algorithmEnum.BCRYPT,
  });

  const user = await findOneAndUpdate({
    model: UserModel,
    filter: { email },
    update: { confirmemailOTP: hashedOTP },
  });

  sendEmailEvent.emit("confirmEmail", {
    to: email,
    firstname: user.firstname,
    otp: newOTP,
  });
  console.log(`${user.firstname}`);
  successResponse({ res, message: "OTP is resent", statuscode: 200 });
};

//-------------------------------------------------------------------------------

export const forgetPasswordOTP = async (req, res) => {
  const { email } = req.body;
  const resetOTP = await generateOtp();

  const hashedOTP = await generateHash({
    plaintext: resetOTP,
    algorithm: algorithmEnum.BCRYPT,
  });

  const user = await findOneAndUpdate({
    model: UserModel,
    filter: { email: email },
    update: {
      forgetPasswordOTP: hashedOTP,
      forgetPasswordOTPExpires: new Date(Date.now() + 2 * 60 * 1000),
    },
  });
  sendEmailEvent.emit("confirmEmail", {
    to: email,
    otp: resetOTP,
    subject: "Reset Password OTP",
    firstname: user.firstname,
  });
  successResponse({ res, message: "Otp is sent", statuscode: 200 });
};
export const resendForgetPasswordOTP = async (req, res) => {
  const { email } = req.body;
  const newOTP = await generateOtp();
  console.log(newOTP);
  const hashedOTP = await generateHash({
    plaintext: newOTP,
    algorithm: algorithmEnum.BCRYPT,
  });

  const user = await findOneAndUpdate({
    model: UserModel,
    filter: { email },
    update: {
      forgetPasswordOTP: hashedOTP,
      forgetPasswordOTPExpires: new Date(Date.now() + 2 * 60 * 1000),
    },
  });

  sendEmailEvent.emit("confirmEmail", {
    to: email,
    firstname: user.firstname,
    otp: newOTP,
  });
  console.log(`${user.firstname}`);
  successResponse({ res, message: "OTP is resent", statuscode: 200 });
};
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await findOne({ model: UserModel, filter: { email: email } });
  if (Date.now() > user.forgetPasswordOTPExpires) {
    throw BadRequestException({
      res,
      message: "OTP Date is expired",
      statuscode: 405,
    });
  }

  const verifyOTP = await compareHash({
    plaintext: otp,
    ciphertext: user.forgetPasswordOTP,
    algorithm: algorithmEnum.BCRYPT,
  });
  if (!verifyOTP) {
    throw BadRequestException({ res, message: "invalid OTP", statuscode: 401 });
  }
  const hashednewpass = await generateHash({
    plaintext: newPassword,
    algorithm: algorithmEnum.BCRYPT,
  });

  await updateOne({
    model: UserModel,
    filter: { email: email },
    update: {
      $set: { password: hashednewpass },
      $unset: { forgetPasswordOTP: true, forgetPasswordOTPExpires: true },
    },
  });

  successResponse({ res, message: "password is changed", statuscode: 200 });
};

export const UpdatePass = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  //console.log(req.user.password);
  //console.log(req.user);
  console.log(oldPassword);
  const compare = await compareHash({
    plaintext: oldPassword,
    ciphertext: req.user.password,
    algorithm: algorithmEnum.BCRYPT,
  });

  if (!compare) {
    throw BadRequestException({
      res,
      message: "oldpassword is incorrect",
      statuscode: 401,
    });
  }
  const hashedpass = await generateHash({
    plaintext: newPassword,
    algorithm: algorithmEnum.BCRYPT,
  });

  await updateOne({
    model: UserModel,
    filter: { _id: req.decoded.id },
    update: {
      password: hashedpass,
    },
  });

  successResponse({ res, statuscode: 201, message: "password is updated" });
};
//-------------------------------------------------------------------------------

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await findOneAndUpdate({
    model: UserModel,
    filter: { email }, //confirmemail: { $exists: true }// },
    update: { changecredintialstime: Date.now() },
  });
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

  const tokens = await getNewCredintials(user, CredintialEnm.REGISTERING);

  return successResponse({
    res,
    statuscode: 200,
    message: "loggedin successfully",
    data: { tokens },
  });
};

export const refreshToken = async (req, res) => {
  await updateOne({
    model: UserModel,
    filter: { _id: req.user._id },
    update: {
      changecredintialstime: Date.now(),
    },
  });
  const token = await getNewCredintials(req.user, CredintialEnm.REFRESH);

  successResponse({
    res,
    statuscode: 200,
    message: "token refreshed successfully",
    data: { token },
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
    message: "user created successfully",
    data: { credintials },
  });
};

export const logout = async (req, res) => {
  const { flag } = req.body;

  switch (flag) {
    case LogoutEnum.LOGOUT:
      await create({
        model: TokensModel,
        data: {
          jti: req.decoded.jti,
          userId: req.user._id,
          expiresIn: new Date(req.decoded.exp * 1000),
        },
      });

      return successResponse({
        res,
        message: "loggedOut Successfuly",
        statuscode: 201,
      });
    case LogoutEnum.LOGOUTALL:
      await updateOne({
        model: UserModel,
        filter: { _id: req.user._id },
        update: { changecredintialstime: Date.now() },
      });
      return successResponse({
        res,
        message: "loggedOut Successfuly",
        statuscode: 200,
      });
  }
};

export const sendmails = async (req, res) => {
  const users = await UserModel.find().select("email");

  for (const user of users) {
    sendEmailEvent.emit("sendEmail", {
      to: user.email,
      subject: "Welcom in our website",
      text: "Congtarts",
    });
  }
  successResponse({ res, message: "email sent", statuscode: 200 });
};

export const changePassword = async (req, res) => {};
