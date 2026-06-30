import multer from "multer";
import path from "path";
import fs from "node:fs";
import { error } from "node:console";
import { fileTypeFromFile } from "file-type";
import { BadRequestException } from "../response/error.response.js";

export const fileValidator = {
  image: ["image/png", "image/jpg", "image/gif"],
  video: ["video/mp4", "video/jpeg", "video/mpeg", "video/mj2"],
  audio: ["audio/mp3", "audio/aac", "audio/3gpp2"],
  documents: ["application/pdf"],
};

export const localFileUpload = ({
  customPath = "general",
  validation = [],
}) => {
  const basePath = `uploads/${customPath}`;
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let userPath = basePath;
      if (req.user?._id) userPath += `/${req.user._id}`;

      const fullPath = path.resolve(`./src/${userPath}`);

      if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
      cb(null, path.resolve(fullPath));
    },

    filename: (req, file, cb) => {
      const uniqeFilename =
        Date.now() + " " + Math.random() + file.originalname;
      file.finalPath = `${basePath}/${req.user._id}/${uniqeFilename}`;
      cb(null, uniqeFilename);
    },
  });
  const fileFilter = (req, file, cb) => {
    if (validation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      return cb(new Error("invalid file type"), false);
    }
  };

  return multer({ fileFilter, storage });
};
