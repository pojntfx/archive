const pm2 = require("pm2");

module.exports.status = async () =>
  new Promise(resolve =>
    pm2.connect(() => {
      pm2.describe("dnsmasq -k --log-dhcp --log-queries", (_, res) => {
        pm2.disconnect();
        resolve(res);
      });
    })
  );
