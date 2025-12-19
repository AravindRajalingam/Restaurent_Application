import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(), // IMPORTANT for Supabase
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
