import joi from "joi";
import mongoose, { Types } from "mongoose";
import {
  GenderEnum,
  ProviderEnum,
  RoleEnum,
} from "../../Utils/enums/user.enum.js";

export const signupSchema = {
  body: joi.object({
    firstname: joi.string().min(2).max(25).required().messages({
      "any.required": "firstname is required",
      "string.max": "fistname has to be maximum 25 characters",
      "string.min": "fistname has to be minimum 2 characters",
    }),
    lastname: joi.string().min(2).max(25).required().messages({
      "any.required": "lastname is required",
      "string.max": "lastname has to be maximum 25 characters",
      "string.min": "lastname has to be minimum 2 characters",
    }),
    email: joi
      .string()
      .email({
        minDomainSegments: 2,
        maxDomainSegments: 5,
        tlds: { allow: ["com", "net", "org"] },
      })
      .required(),
    password: joi
      .string()
      .alphanum()
      .required()
      .messages({ "any.messages": "password should be in this format" }),
    confirmpassword: joi.ref("password"),
    phone: joi.string().pattern(/^(\+20|020|0)?1[0125][0-9]{8}$/),
    id: joi.string().custom((value, helper) => {
      return Types.ObjectId.isValid(value) || helper.message("wrong id format");
    }),

    gender: joi.string().valid(...Object.values(GenderEnum)),
    provider: joi.string().valid(...Object.values(ProviderEnum)),
    role: joi.string().valid(...Object.values(RoleEnum)),
    profilepic: joi.string(),
    coverimage: joi.array().items(joi.string()),
    confirmemail: joi.string().isoDate(),
  }),
};
