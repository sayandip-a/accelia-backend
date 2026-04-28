const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "resumes";
    let resource_type = "raw";

    if (file.mimetype.startsWith("image")) {
      folder = "images";
      resource_type = "image";
    } else if (file.mimetype.startsWith("video")) {
      folder = "videos";
      resource_type = "video";
    }

    return {
      folder,
      resource_type,
      public_id: Date.now() + "-" + file.originalname,
    };
  },
});

module.exports = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
