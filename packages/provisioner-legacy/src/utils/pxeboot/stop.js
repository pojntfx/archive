const pm2 = require("pm2");

module.exports.stop = async () =>
  new Promise(resolve =>
    pm2.connect(() => {
      pm2.stop("dnsmasq -k --log-dhcp --log-queries", (_, res) => {
        pm2.disconnect();
        resolve(res);
      });
    })
  );
