const shell = require("shelljs");

module.exports.exposeBucket = async () =>
  shell.exec("mc policy download repo_s3/repo");
