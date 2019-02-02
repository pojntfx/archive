const fs = require("fs");
const { set } = require("../../utils/dnsmasq/set");
const { get } = require("../../utils/dnsmasq/get");
const { start } = require("../../utils/dnsmasq/start");
const { stop } = require("../../utils/dnsmasq/stop");
const { logs } = require("../../utils/dnsmasq/logs");
const { status } = require("../../utils/dnsmasq/status");
const { init } = require("../../utils/dnsmasq/init");
const { getInterfaces } = require("../../utils/dnsmasq/getInterfaces");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
  name: "dnsmasq",
  dependencies: ["ipxe"],
  actions: {
    set: {
      params: {
        interface: "string",
        domain: "string",
        script: "string"
      },
      handler: async ctx => {
        const tempdir = `/tmp/pojntfx/os`;
        const iPXEBIOSPath = `${tempdir}/undionly.kpxe`;
        const iPXEUEFIPath = `${tempdir}/ipxe.efi`;
        const tftpDir = `${tempdir}/tftproot`;
        const scriptDir = `${tempdir}/script`;

        await init(iPXEBIOSPath, iPXEUEFIPath, scriptDir);

        const ipxeBIOS = fs.createWriteStream(iPXEBIOSPath);
        const streamBIOS = await ctx.call("ipxe.create", {
          script: ctx.params.script,
          platform: "bin-x86_64-pcbios",
          driver: "ipxe",
          extension: "kpxe"
        });
        streamBIOS.pipe(ipxeBIOS);

        const ipxeUEFI = fs.createWriteStream(iPXEUEFIPath);
        const streamUEFI = await ctx.call("ipxe.create", {
          script: ctx.params.script,
          platform: "bin-x86_64-efi",
          driver: "ipxe",
          extension: "efi"
        });
        streamUEFI.pipe(ipxeUEFI);

        return new Promise(resolve =>
          ipxeBIOS.on("finish", () =>
            ipxeUEFI.on("finish", () => {
              set({
                ...ctx.params,
                tftpDir,
                scriptDir,
                iPXEBIOSPath,
                iPXEUEFIPath
              }).then(async () => resolve(await ctx.call("dnsmasq.get")));
            })
          )
        );
      }
    },
    get: async () => get(`/tmp/pojntfx/os/script`),
    getStatus: async () => await status(),
    setStatus: {
      params: {
        on: "boolean"
      },
      handler: async ctx => (ctx.params.on ? await start() : await stop())
    },
    logs: async ctx => {
      ctx.meta.$responseType = "text/plain";
      const res = await logs();
      if (res !== false) {
        return res;
      } else {
        throw new MoleculerError(
          "The DNSMasq systemd service is not yet running",
          404,
          "LOGS_NOT_FOUND_SERVICE_NOT_RUNNING"
        );
      }
    },
    interfaces: async () => getInterfaces()
  }
};
