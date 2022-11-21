/* Imports */
const routes = require("express").Router();
const multer = require("multer");
const multerConfig = require("./config/multer");
const Post = require("./models/Post");
const AWSV2 = require("./config/aws");

/* Criação da rota /post -> GET */
routes.get("/posts", async (request, response) => {
  try {
    /* Tras todos os dados do banco mangoose */
    const posts = await Post.find();
    /* Verifica se o array esta vazio, se estiver da um error. */
    if (posts.length === 0) {
      response.json("Error ao trazer os dados do banco!");
    } else {
      /* Envia os dados do banco */
      response.json(posts);
    }
  } catch (error) {
    /* Tratamento de error */
    response.json({ error: error, message: "Ops! um error foi gerado" });
  }
});

/* Rota /post/:parametro */
routes.post("/posts", multer(multerConfig).single("file"), async (request, response) => {
  const { originalname: name, size, key, location: url = "" } = request.file;
  /* Registra os dados do arquivo no banco de dados */
  const post = await Post.create({
    name,
    size,
    key,
    url,
  });

  return response.json(post);
});

/* Rota para deletar o registro do arquivo no banco de dados */
routes.delete("/posts/:id", async (request, response) => {
  let post = "";
  /* Tratamento de error */
  try {
    post = await Post.findById(request.params.id);
  } catch (error) {
    response.send("Arquivo não encontrado!");
  } finally {
    if (post) {
      await post.remove();
      response.send(post);
    } else {
      response.send("Arquivo não encontrado em nossa base da dados");
    }
  }
});

/* Rota download do arquivo do servidor aws s3 */
routes.get("/posts/download/:id", async (request, response) => {
  let post = "";
  /* Tratamento de error */
  try {
    post = await Post.findById(request.params.id);
  } catch (error) {
    response.send("Arquivo não encontrado!");
  } finally {
    if (post) {
      const s3 = new AWSV2.AWS.S3();
      s3.getObject({
        Bucket: process.env.BUCKET_NAME,
        Key: post["key"],
      })
        .createReadStream()
        .pipe(response);
    } else {
      response.send("Arquivo não encontrado em nossa base da dados");
    }
  }
});

/* ----------------------------------------------------------------*/
/*  Para você criar um getSignedUrl, você precisa estar com a V3 da 
aws api, que eh @aws-sdk/s3-request-presigner + @aws-sdk/client-s3, 
*/
/* --------------------------------------------------------------- */
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION,
  },
});

routes.get("/posts/signed-url/:id", async (request, response) => {
  let post = "";
  /* Tratamento de error */
  try {
    post = await Post.findById(request.params.id);
  } catch (error) {
    response.send("Arquivo não encontrado!");
  } finally {
    if (post) {
      const command = new GetObjectCommand({ Bucket: process.env.BUCKET_NAME, Key: post["key"] });
      const url = await getSignedUrl(s3, command, { expiresIn: 15 * 60 }); // expires in seconds
      response.send(url);
    } else {
      response.send("Arquivo não encontrado em nossa base da dados");
    }
  }
});

module.exports = routes;
