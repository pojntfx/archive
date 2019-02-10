const shell = require("shelljs");

module.exports.publishToBucket = async outdir =>
  shell.exec(`mc mirror ${outdir} repo_s3/repo --remove --overwrite`);
