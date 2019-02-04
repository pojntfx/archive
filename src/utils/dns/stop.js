const pm2 = require("pm2");

module.exports.stop = async name =>
  new Promise(resolve => {
    pm2.connect(() => {
      pm2.stop(name, (_, res) => {
        pm2.disconnect();
        resolve(res);
      });
    });
  });
