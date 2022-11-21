/* Imports */
const mongoose = require("mongoose");
const AWSV2 = require("../config/aws");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

/* Criar uma nova instancia da aws */
const s3 = new AWSV2.AWS.S3();

/* Define um schema para "TABELA" do mongoose */
const PostSchema = new mongoose.Schema({
  name: String,
  size: Number,
  key: String,
  url: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/* Salva */
PostSchema.pre("save", function () {
  if (!this.url) {
    this.url = `${process.env.APP_URL}/files/${this.key}`;
  }
});

/* Remove */
PostSchema.pre("remove", function () {
  if (process.env.STORAGE_TYPE === "s3") {
    return s3
      .deleteObject({
        Bucket: process.env.BUCKET_NAME,
        Key: this.key,
      })
      .promise()
      .then((response) => {
        console.log(response);
      })
      .catch((response) => {
        console.log(response);
      });
  } else {
    return promisify(fs.unlink)(path.resolve(__dirname, "..", "..", "tmp", "uploads", this.key));
  }
});

module.exports = mongoose.model("Post", PostSchema);
