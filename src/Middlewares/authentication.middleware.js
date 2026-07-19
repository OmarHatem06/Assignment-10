import { findById, findOne } from "../DB/database.repository.js";
import TokensModel from "../DB/Models/tokens.model.js";
import UserModel from "../DB/Models/users.model.js";
import { signatureEnum, tokenTypeEnum } from "../Utils/enums/user.enum.js";
import { BadRequestException } from "../Utils/response/error.response.js";
import { getSignature, verifyToken } from "../Utils/tokens/tokens.js";

export const decodedToken = async ({
  authorization,
  tokentype = tokenTypeEnum.ACCESS,
}) => {
  const [Bearer, token] = authorization?.split(" ") || [];

  let signature = await getSignature({
    signatureLevel:
      Bearer === "ADMIN"
        ? signatureEnum.ADMIN
        : Bearer === "USER"
          ? signatureEnum.USER
          : new Error("invalid token type"),
  });

  const decoded = await verifyToken({
    Token: token,
    secretKey:
      tokentype === tokenTypeEnum.ACCESS
        ? signature.accessSignature
        : signature.refreshSignature,
  });

  /* const revoked = await findOne({
    model: TokensModel,
    filter: { jti: decoded.jti },
  });
  if (revoked) throw BadRequestException("token is revoked");
*/
  const user = await findById({ model: UserModel, _id: decoded.id });

  if (!user) {
    throw BadRequestException("user not found");
  }
  if (tokentype === tokenTypeEnum.ACCESS) {
    if (
      (user.changecredintialstime?.getTime() || 0) >=
      decoded.iat * 1000 + 1000
    ) {
      throw BadRequestException("token is revoked");
    }
  }
  return { user, decoded };
};

export const authentication = ({ tokentype = tokenTypeEnum.ACCESS }) => {
  return async (req, res, next) => {
    const { user, decoded } = await decodedToken({
      authorization: req.headers.authorization,
      tokentype,
    });
    req.user = user;
    req.decoded = decoded;

    return next();
  };
};

export const authorization = ({ accessRole = [] }) => {
  return async (req, res, next) => {
    if (!accessRole.includes(req.user.role)) {
      throw BadRequestException("you are not authorized to access this route");
    }
    return next();
  };
};
