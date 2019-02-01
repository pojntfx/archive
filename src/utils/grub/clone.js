const shell = require("shelljs");

module.exports.clone = async indir =>
  shell.ls("-A", indir).find(file => file === ".git")
    ? shell.exec(`git --git-dir="${indir}/.git" --work-tree="${indir}" pull`)
    : shell.exec(
        `git clone https://git.savannah.gnu.org/git/grub.git "${indir}"`
      );
