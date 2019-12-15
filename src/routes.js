const routes = require("express").Router();
const multer = require("multer");
const multerConfig = require("./config/multer");

const uploadController = require('./controllers/uploadController');

routes.get("/posts", uploadController.list);

routes.post("/posts", multer(multerConfig).single("file"), uploadController.create);

routes.delete("/posts/:id", uploadController.delete);

module.exports = routes;
