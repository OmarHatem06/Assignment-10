import jwt from "jsonwebtoken";

import { BadRequestException } from "../../Utils/response/error.response.js";
import { successResponse } from "../../Utils/response/success.response.js";
import { findById, findByIdandUpdate } from "../../DB/database.repository.js";
import UserModel from "../../DB/Models/users.model.js";
export const getuser = async (req, res) => {
  const { user } = req;
  successResponse({ res, statuscode: 200, data: { user } });
};

export const updateProfilepic = async (req, res) => {
  const user = await findByIdandUpdate({
    model: UserModel,
    id: req.user._id,
    update: { profilepic: req.file.finalPath },
  });

  successResponse({ res, statuscode: 200, data: { user } });
};

export const coverimages = async (req, res) => {
  const user = await findByIdandUpdate({
    model: UserModel,
    id: req.user._id,
    update: { coverimage: req.files?.map((file) => file.finalPath) },
  });

  successResponse({ res, statuscode: 200, data: { user } });
};
