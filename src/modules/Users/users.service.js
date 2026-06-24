import jwt from "jsonwebtoken";

import { BadRequestException } from "../../Utils/response/error.response.js";
import { successResponse } from "../../Utils/response/success.response.js";
import { findOne } from "../../DB/database.repository.js";
import UserModel from "../../DB/Models/users.model.js";
export const getuser = async (req, res) => {
  const { user } = req;
  successResponse({ res, statuscode: 200, data: { user } });
};
