import { Cost_Rounds } from "../../Configs/config.service.js";
import { algorithmEnum } from "../enums/algorithm.enum.js";
import { hash } from "bcrypt";
import { compare } from "bcrypt";
import * as argon2 from "argon2";
import { BadRequestException } from "../response/error.response.js";
export const generateHash = async ({
  plaintext,
  costrounds = Number(Cost_Rounds),
  algorithm = algorithmEnum.BCRYPT,
}) => {
  let hashresult;
  switch (algorithm) {
    case algorithmEnum.BCRYPT:
      hashresult = await hash(plaintext, costrounds);
      break;
    case algorithmEnum.ARGON2:
      hashresult = await argon2.hash(plaintext);
      break;
    default:
      throw BadRequestException(" hashing algorithm");
  }
  return hashresult;
};

export const compareHash = async ({ plaintext, ciphertext, algorithm }) => {
  let match;
  switch (algorithm) {
    case algorithmEnum.BCRYPT:
      match = await compare(plaintext, ciphertext);
      break;
    case algorithmEnum.ARGON2:
      match = await argon2.verify(ciphertext, plaintext);
      break;
    default:
      throw BadRequestException(" hashing algorithm");
  }
  return match;
};
