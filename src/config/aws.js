/* Configuração do AWS VERSÃO 2 */
const AWS = require("aws-sdk");
AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY },
});

module.exports = {
  AWS,
};
