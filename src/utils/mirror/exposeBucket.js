const shell = require("shelljs");

module.exports.exposeBucket = async () =>
  shell.exec("mc policy download mirror_s3/repo");
