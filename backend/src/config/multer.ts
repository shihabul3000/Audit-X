import multer from "multer";
import path from "path";
import { config } from "./index";

export const multerUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(process.cwd(), config.UPLOAD_DIR, "profiles");
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const userId = (req as any).user?.id || "unknown";
      const timestamp = Date.now();
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${userId}-${timestamp}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed."));
    }
  },
  limits: {
    fileSize: config.MAX_FILE_SIZE,
  },
});
