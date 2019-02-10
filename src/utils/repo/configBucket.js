const shell = require("shelljs");

module.exports.configBucket = (s3Endpoint, username, password) => {
  shell.exec(
    `mc config host add repo_s3 ${s3Endpoint} ${username} ${password}`
  );
  shell.exec(`mc mb repo_s3/repo`);
};
