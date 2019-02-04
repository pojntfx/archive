const pm2 = require("pm2");

module.exports.start = async ({ tempdir, name }) =>
  new Promise(resolve => {
    pm2.connect(() => {
      pm2.start(
        {
          script: "dnsmasq",
          args: `-k -C "${tempdir}/dnsmasq.conf"`,
          name
        },
        (_, res) => {
          pm2.disconnect();
          resolve(res);
        }
      );
    });
  });
