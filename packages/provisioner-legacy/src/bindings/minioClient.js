const shell = require("shelljs");

module.exports.MinioClient = class {
  static async addHost({ name, s3Endpoint, username, password }) {
    return shell.exec(
      `mc config host add ${name} ${s3Endpoint} ${username} ${password}`
    );
  }
  static async createBucket({ hostName, bucketName }) {
    return shell.exec(`mc mb ${hostName}/${bucketName}`);
  }
  static async setPolicy({ hostName, bucketName, policy }) {
    return shell.exec(`mc policy ${policy} ${hostName}/${bucketName}`);
  }
  static async mirror({ src, hostName, bucketName }) {
    return shell.exec(
      `mc mirror ${src} ${hostName}/${bucketName} --remove --overwrite`
    );
  }
};
