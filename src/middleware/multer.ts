import { Request } from "express";
import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
  destination(req: Request, file: Express.Multer.File, callback) {
    callback(null, "uploads");
  },
  filename(req: Request, file: Express.Multer.File, callback) {
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname),
    );
  },
});
export const upload = multer({ storage });
