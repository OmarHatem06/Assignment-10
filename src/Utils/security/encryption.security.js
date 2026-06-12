import crypto from "crypto";
import { Secret_Key } from "../../Configs/config.service.js";

const IV_Length = 16;
const Encryption_Secret_Key = Buffer.from(Secret_Key);
export const encryption = (text) => {
  const iv = crypto.randomBytes(IV_Length);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Encryption_Secret_Key,
    iv,
  );

  let encryptedData = cipher.update(text, "utf-8", "hex");
  encryptedData += cipher.final("hex");
  return `${iv.toString("hex")}:${encryptedData}`;
};

export const decryption = (encryptedText) => {
  const [ivHex, encryptedData] = encryptedText.split(":");
  const binaryIv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Encryption_Secret_Key,
    binaryIv,
  );
  let decryptedData = decipher.update(encryptedData, "hex", "utf-8");
  decryptedData += decipher.final("utf-8");
  return decryptedData;
};
