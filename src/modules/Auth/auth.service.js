import { create, findOne } from "../../DB/database.repository.js";

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
  const decryptedphone = await decryption(user.phone);
  if (decryptedphone) user.phone = decryptedphone;
  return successResponse({
    res,
    statuscode: 200,
    message: "loggedin successfully",
    data: { user },
  });
};
