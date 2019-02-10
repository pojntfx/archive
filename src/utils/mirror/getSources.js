const shell = require("shelljs");

module.exports.getSources = async srcdir =>
  shell.ls("-A", srcdir).find(file => file === ".git")
    ? shell.exec(`git --git-dir="${srcdir}/.git" --work-tree="${srcdir}" pull`)
    : shell.exec(
        `git clone https://pagure.io/quick-fedora-mirror.git "${srcdir}"`
      );
