const { updateScript } = require("../../utils/pxeboot/updateScript");
const { getScript } = require("../../utils/pxeboot/getScript");
const { init } = require("../../utils/pxeboot/init");
const { start } = require("../../utils/dns/start");
const { stop } = require("../../utils/dns/stop");
const { getStatus } = require("../../utils/dns/getStatus");
const { getLogs } = require("../../utils/dns/getLogs");
const { getInterfaces } = require("../../utils/dns/getInterfaces");
const { getPorts } = require("../../utils/dns/getPorts");
const { MoleculerError } = require("moleculer").Errors;
const fs = require("fs");

module.exports = {
  name: "pxeboot",
  actions: {
    updateScript: {
      params: {
        interface: "string",
        domain: "string",
        script: "string"
      },
      handler: async ctx => {
        ctx.meta.$responseType = "text/plain";

        const tempdir = `/tmp/pojntfx/provisioner/pxeboot`;
        const iPXEBIOSPath = `${tempdir}/undionly.kpxe`;
        const iPXEUEFIPath = `${tempdir}/ipxe.efi`;
        const tftpDir = `${tempdir}/tftproot`;
        const scriptDir = `${tempdir}/script`;

        await init(iPXEBIOSPath, iPXEUEFIPath, scriptDir);

        const ipxeBIOS = fs.createWriteStream(iPXEBIOSPath);
        const streamBIOS = await ctx.call(
          "ipxe.create",
          {
            script: ctx.params.script,
            platform: "bin-x86_64-pcbios",
            driver: "ipxe",
            extension: "kpxe"
          },
          { timeout: 300000 }
        );
        streamBIOS.pipe(ipxeBIOS);

        const ipxeUEFI = fs.createWriteStream(iPXEUEFIPath);
        const streamUEFI = await ctx.call(
          "ipxe.create",
          {
            script: ctx.params.script,
            platform: "bin-x86_64-efi",
            driver: "ipxe",
            extension: "efi"
          },
          { timeout: 300000 }
        );
        streamUEFI.pipe(ipxeUEFI);

        return new Promise(resolve =>
          ipxeBIOS.on("finish", () =>
            ipxeUEFI.on("finish", () =>
              updateScript({
                ...ctx.params,
                tftpDir,
                scriptDir,
                iPXEBIOSPath,
                iPXEUEFIPath,
                tempdir: `/tmp/pojntfx/provisioner/pxeboot/script`
              }).then(async () => resolve(await ctx.call("pxeboot.getScript")))
            )
          )
        );
      }
    },
    getScript: async ctx => {
      ctx.meta.$responseType = "text/plain";
      ctx.meta.$responseType = "text/plain";
      const script = await getScript(`/tmp/pojntfx/provisioner/pxeboot/script`);
      if (script !== false) {
        return script;
      } else {
        throw new MoleculerError(
          "No mainscript has yet been written",
          404,
          "ERR_MAINSCRIPT_SCRIPT_NOT_FOUND"
        );
      }
    },
    updateStatus: {
      params: {
        on: "boolean"
      },
      handler: async ctx =>
        ctx.params.on
          ? await start({
              tempdir: "/tmp/pojntfx/provisioner/pxeboot/script",
              name: "dnsmasq-pxeboot"
            })
          : await stop("dnsmasq-pxeboot")
    },
    getStatus: async () => await getStatus("dnsmasq-pxeboot"),
    getLogs: async ctx => {
      ctx.meta.$responseType = "text/plain";
      const res = await getLogs("dnsmasq-pxeboot");
      if (res !== false) {
        return res;
      } else {
        throw new MoleculerError(
          "The DNSMasq systemd service is not yet running",
          404,
          "ERR_LOGS_NOT_FOUND_SERVICE_NOT_RUNNING"
        );
      }
    },
    getInterfaces: async ctx => {
      ctx.meta.$responseType = "text/plain";
      return await getInterfaces();
    },
    getPorts: async ctx => {
      ctx.meta.$responseType = "text/plain";
      return await getPorts();
    }
  }
};
