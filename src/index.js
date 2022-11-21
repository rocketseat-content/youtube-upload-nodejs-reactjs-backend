/* Imports */
require("dotenv").config();

/* Variaveis */
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const app = express();
var mongooseConnectionStatus;

/* Strings: \x1b[32m, \x1b[34m \x1b[33m significa cores para quando imprimir 
  no terminal a mensagens ficarem colorida
*/

/**
 * Database setup
 */
(async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
    });
    mongooseConnectionStatus = true;
    console.log(`\x1b[34m Database connected to: \x1b[32m${db.connection.name}`);
  } catch (error) {
    server.close((err) => {
      console.log("Banco não está conectado servidor morrendo....");
      process.exit(err ? 1 : 0);
    });
  }
})();

/* Add CORS */
app.use(cors());

/*  Add JSON */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/files", express.static(path.resolve(__dirname, "..", "tmp", "uploads")));

/* Add Rotas */
app.use(require("./routes"));

/* Tratamento de error 404 */
app.use(function (request, response, next) {
  response.status(404).send("Esta rota não existe");
});

/* Start server */
const server = app.listen(process.env.APP_PORT, process.env.APP_IP, function () {
  console.log(`\x1b[34m Servidor rodando com o \x1b[32m IP: ${process.env.APP_IP} \x1b[33m PORT: ${process.env.APP_PORT}`);
});

server.setTimeout(5000);
