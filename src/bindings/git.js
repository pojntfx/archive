const shell = require("shelljs");

module.exports.Git = class {
  static async cloneOrPullRepo(remote, dest) {
    return shell.ls("-A", dest).find(file => file === ".git")
      ? shell.exec(`git --git-dir="${dest}/.git" --work-tree="${dest}" pull`)
      : shell.exec(`git clone ${remote} "${dest}"`);
  }
};
