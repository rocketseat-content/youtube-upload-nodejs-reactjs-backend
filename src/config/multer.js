/* Imports */
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const AWSV2 = require("./aws");
const multerS3 = require("multer-s3");

/* Você pode selecionar o tipo de storage padrão no arquivo .env
   pode ser s3 ou local
*/
const storageTypes = {
  /* Storage Local */
  local: multer.diskStorage({
    destination: (request, file, callback) => {
      callback(null, path.resolve(__dirname, "..", "..", "tmp", "uploads"));
    },
    filename: (request, file, callback) => {
      crypto.randomBytes(16, (error, hash) => {
        if (error) callback(error);

        file.key = `${hash.toString("hex")}-${file.originalname}`;

        callback(null, file.key);
      });
    },
  }),

  /* Storage s3 */
  s3: multerS3({
    s3: new AWSV2.AWS.S3(),
    bucket: process.env.BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    /* Se o seu bucket for 
    public -> acl: 'public'
    privado -> acl: 'privado', 
    caso contrario irar dar um error de access denied' 
    */
    acl: "private",
    key: (request, file, callback) => {
      crypto.randomBytes(16, (error, hash) => {
        if (error) callback(error);

        const fileName = `${hash.toString("hex")}-${file.originalname}`;

        callback(null, fileName);
      });
    },
  }),
};

module.exports = {
  dest: path.resolve(__dirname, "..", "..", "tmp", "uploads"),
  storage: storageTypes[process.env.STORAGE_TYPE],
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  /* Verifica o tipo de arquivo */
  fileFilter: (request, file, callback) => {
    const allowedMimes = ["image/jpeg", "image/pjpeg", "image/png", "image/gif"];

    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Invalid file type."));
    }
  },
};
