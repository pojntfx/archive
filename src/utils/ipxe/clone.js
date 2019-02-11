const { Git } = require("../../bindings/git");

module.exports.clone = async indir =>
  Git.cloneOrPullRepo("https://github.com/ipxe/ipxe.git", indir);
