const shell = require("shelljs");

module.exports.clone = async indir =>
  shell.ls("-A", indir).find(file => file === ".git")
    ? shell.exec(`git --git-dir="${indir}/.git" --work-tree="${indir}" pull`)
    : shell.exec(`git clone https://github.com/madnight/grub.git "${indir}"`);
