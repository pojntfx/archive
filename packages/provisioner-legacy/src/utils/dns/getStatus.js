const pm2 = require("pm2");

module.exports.getStatus = async name =>
  new Promise(resolve => {
    pm2.connect(() => {
      pm2.describe(name, (_, res) => {
        pm2.disconnect();
        resolve(res);
      });
    });
  });
