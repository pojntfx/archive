const pm2 = require("pm2");
const shell = require("shelljs");

module.exports.getLogs = async name =>
  new Promise(resolve => {
    pm2.connect(() => {
      pm2.describe(name, (_, res) => {
        pm2.disconnect();
        if (res[0]) {
          resolve(shell.cat(res[0].pm2_env.pm_out_log_path));
        } else {
          resolve(false);
        }
      });
    });
  });
