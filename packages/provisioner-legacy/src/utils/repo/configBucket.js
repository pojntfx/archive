const { MinioClient } = require("../../bindings/minioClient");

module.exports.configBucket = async (s3Endpoint, username, password) => {
  await MinioClient.addHost({
    name: "repo_s3",
    s3Endpoint,
    username,
    password
  });
  return await MinioClient.createBucket({
    hostName: "repo_s3",
    bucketName: "repo"
  });
};
