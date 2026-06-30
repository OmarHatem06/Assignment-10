import mongoose, { Schema } from "mongoose";

const TokenSchema = new mongoose.Schema(
  {
    jti: {
      required: true,
      type: String,
      unique: true,
    },
    userId: {
      ref: "user",
      type: Schema.Types.ObjectId,
      required: true,
    },

    expiresIn: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);
TokenSchema.index("expiresIn", { expireAfterSeconds: 1000 });
export const TokensModel = mongoose.model("Tokens", TokenSchema);
export default TokensModel;
