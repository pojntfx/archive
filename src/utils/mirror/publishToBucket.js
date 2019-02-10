const shell = require("shelljs");

module.exports.publishToBucket = async outdir =>
  shell.exec(`mc mirror ${outdir} mirror_s3/repo --remove --overwrite`);
