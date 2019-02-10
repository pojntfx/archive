const shell = require("shelljs");

module.exports.configBucket = (s3Endpoint, username, password) => {
  shell.exec(
    `mc config host add mirror_s3 ${s3Endpoint} ${username} ${password}`
  );
  shell.exec(`mc mb mirror_s3/repo`);
};
