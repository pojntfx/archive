const { Git } = require("../../bindings/git");

module.exports.getSources = async srcdir =>
  Git.cloneOrPullRepo("https://pagure.io/quick-fedora-mirror.git", srcdir);
