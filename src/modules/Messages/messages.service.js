import {
  create,
  find,
  findById,
  findOne,
} from "../../DB/database.repository.js";
import { messageModel } from "../../DB/Models/messages.model.js";
import UserModel from "../../DB/Models/users.model.js";
import { BadRequestException } from "../../Utils/response/error.response.js";
import { successResponse } from "../../Utils/response/success.response.js";

export const sendmessage = async (req, res) => {
  const { receiverid } = req.params;
  const { content } = req.body;
  const user = await findOne({
    model: UserModel,
    filter: {
      _id: receiverid,
      freezedAt: { $exists: false },
    },
  });
  if (!user) {
    BadRequestException("usernotfound");
  }

  const sendmsg = await create({
    model: messageModel,
    data: [{ content, receiverid }],
  });
  successResponse({
    res,
    statuscode: 201,
    message: "message sent",
    data: sendmsg,
  });
};

export const getmsg = async (req, res) => {
  const { page = 1, limit = 2 } = req.query;
  const receiverid = req.user._id;
  const skip = (page - 1) * limit;

  const [messages, totalmessages] = await Promise.all([
    await messageModel
      .find({ receiverid })
      .sort({
        createdAt: -1,
      })
      .skip(Number(skip))
      .limit(Number(limit)),
    await messageModel.countDocuments({ receiverid }),
  ]);

  successResponse({
    res,
    message: "your messages",
    statuscode: 200,
    data: {
      messages,
      pagination: {
        currenPage: Number(page),
        totalPages: Math.ceil(totalmessages / limit),
        totalmessages: totalmessages,
      },
    },
  });
};

export const toggleread = async (req, res) => {
  const { messageid } = req.params;
  const receiverid = req.user._id;
  const message = await findById({ model: messageModel, _id: messageid });
  if (!message || message.receiverid.toString() !== receiverid.toString()) {
    throw BadRequestException("not authorized");
  }
  message.isRead = !message.isRead;
  await message.save();
  successResponse({
    res,
    message: `message is now ${message.isRead ? "Read" : "Unread"}`,
    statuscode: 200,
    data: { updatemessage: message },
  });
};

export const togglefavourite = async (req, res) => {
  const { messageid } = req.params;
  const receiverid = req.user._id;
  const message = await findById({ model: messageModel, _id: messageid });
  if (!message || message.receiverid.toString() !== receiverid.toString()) {
    throw BadRequestException("not authorized");
  }
  message.isFavorite = !message.isFavorite;
  await message.save();
  successResponse({
    res,
    message: `message is now ${message.isFavorite ? "Favourite" : "Not Favourite"}`,
    statuscode: 200,
    data: { updatemessage: message },
  });
};
