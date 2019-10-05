const { MinioClient } = require("../../bindings/minioClient");

module.exports.exposeBucket = async () =>
  MinioClient.setPolicy({
    hostName: "repo_s3",
    bucketName: "repo",
    policy: "download"
  });
