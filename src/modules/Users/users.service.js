import jwt from "jsonwebtoken";

import { BadRequestException } from "../../Utils/response/error.response.js";
import { successResponse } from "../../Utils/response/success.response.js";
import {
  deleteOne,
  findById,
  findByIdAndUpdate,
  findOneAndUpdate,
} from "../../DB/database.repository.js";
import UserModel from "../../DB/Models/users.model.js";
import { RoleEnum } from "../../Utils/enums/user.enum.js";
export const getuser = async (req, res) => {
  const { user } = req;
  successResponse({ res, statuscode: 200, data: { user } });
};

export const updateProfilepic = async (req, res) => {
  const user = await findByIdAndUpdate({
    model: UserModel,
    id: req.user._id,
    update: { profilepic: req.file.finalPath },
  });

  successResponse({ res, statuscode: 200, data: { user } });
};

export const coverimages = async (req, res) => {
  const user = await findByIdAndUpdate({
    model: UserModel,
    id: req.user._id,
    update: { coverimage: req.files?.map((file) => file.finalPath) },
  });

  successResponse({ res, statuscode: 200, data: { user } });
};

export const freeze = async (req, res) => {
  const { userid } = req.params;
  const targetUserId = userid || req.user._id;
  if (
    targetUserId.toString() !== req.user._id.toString() &&
    req.user.role != RoleEnum.ADMIN
  ) {
    throw BadRequestException();
  }
  const user = await findOneAndUpdate({
    model: UserModel,
    filter: { _id: targetUserId, freezedAt: { $exists: false } },
    update: {
      freezedAt: Date.now(),
      freezedBy: req.user._id,
      freezedByRole: req.user.role,
      $unset: {
        restoredBy: true,
        restoredAt: true,
      },
    },
  });
  successResponse({
    res,
    message: "account freezed successfuly",
    statuscode: 200,
  });
};

export const restore = async (req, res) => {
  const { userid } = req.params;
  const targetUserId = userid || req.user._id;

  const user = await findById({ model: UserModel, _id: req.user._id });
  if (user.freezedByRole === RoleEnum.ADMIN) {
    if (req.user.role !== RoleEnum.ADMIN) {
      throw BadRequestException(
        "this account was freezed by the admin only admin can restore it ",
      );
    }
  }

  if (req.user._id !== targetUserId && req.user.role !== RoleEnum.ADMIN) {
    throw BadRequestException("you are not authorized to restore this account");
  }

  const update = await findOneAndUpdate({
    model: UserModel,
    filter: { _id: targetUserId, freezedAt: { $exists: true } },
    update: {
      restoredBy: req.user._id,
      restoredAt: Date.now(),
      $unset: {
        freezedAt: true,
        freezedBy: true,
        freezedByRole: true,
      },
    },
  });
  console.log({ update: { update } });
  successResponse({
    res,
    message: "account is restored successfuly",
    statuscode: 200,
    data: { update },
  });
};

export const deleteaccount = async (req, res) => {
  const { userid } = req.params;

  const results = await deleteOne({
    model: UserModel,
    filter: { _id: userid },
  });
  if (!results.deletedCount) {
    throw BadRequestException();
  }
  successResponse({ res, message: "deleted successfully " });
};
