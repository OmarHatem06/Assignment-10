import mongoose, { Schema } from "mongoose";
import {
  GenderEnum,
  ProviderEnum,
  RoleEnum,
} from "../../Utils/enums/user.enum.js";
const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "first name is mandatory"],
      minlength: 2,
      maxlength: 25,
    },
    lastname: {
      type: String,
      required: [true, "last name is mandatory"],
      minlength: 2,
      maxlength: 25,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // required: function () {
      // return this.provider == ProviderEnum.SYSTEM;
    },
    confirmpassword: { type: String },
    freezedAt: { type: Date },
    freezedBy: { type: Schema.Types.ObjectId, ref: "User" },
    freezedByRole: { type: Number, enum: Object.values(RoleEnum) },
    restoredBy: { type: Schema.Types.ObjectId, ref: "User" },
    restoredAt: { type: Date },
    DOB: { type: Date },
    phone: { type: String },
    confirmemail: { type: Date },
    confirmemailOTP: { type: String },
    forgetPasswordOTP: { type: String },
    forgetPasswordOTPExpires: { type: Date },
    profilepic: { type: String },
    coverimage: [String],
    changecredintialstime: { type: Date },
    gender: {
      type: Number,
      enum: Object.values(GenderEnum),
      default: GenderEnum.MALE,
    },
    role: {
      type: Number,
      enum: Object.values(RoleEnum),
      default: RoleEnum.USER,
    },
    provider: {
      type: Number,
      enum: Object.values(ProviderEnum),
      default: ProviderEnum.SYSTEM,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: false },
    toJSON: { virtuals: false },
  },
);
userSchema;

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
