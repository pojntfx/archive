const shell = require("shelljs");
const { MinioClient } = require("../../bindings/minioClient");

module.exports.publishToBucket = async outdir =>
  await MinioClient.mirror({
    src: outdir,
    hostName: "repo_s3",
    bucketName: "repo"
  });
