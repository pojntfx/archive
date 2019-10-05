const { updateScript } = require("../../utils/dns/updateScript");
const { getScript } = require("../../utils/dns/getScript");
const { updateHosts } = require("../../utils/dns/updateHosts");
const { getHosts } = require("../../utils/dns/getHosts");
const { start } = require("../../utils/dns/start");
const { stop } = require("../../utils/dns/stop");
const { getStatus } = require("../../utils/dns/getStatus");
const { getLogs } = require("../../utils/dns/getLogs");
const { getInterfaces } = require("../../utils/dns/getInterfaces");
const { getPorts } = require("../../utils/dns/getPorts");
const { getLookup } = require("../../utils/dns/getLookup");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
  name: "dns",
  actions: {
    updateScript: {
      params: {
        noDhcpInterface: "string",
        domain: "string",
        firstNameServer: "string",
        secondNameServer: "string"
      },
      handler: async ctx => {
        ctx.meta.$responseType = "text/plain";
        return await updateScript({
          ...ctx.params,
          tempdir: `/tmp/pojntfx/provisioner/dns`
        });
      }
    },
    getScript: async ctx => {
      ctx.meta.$responseType = "text/plain";
      const script = await getScript(`/tmp/pojntfx/provisioner/dns`);
      if (script !== false) {
        return script;
      } else {
        throw new MoleculerError(
          "No DNS script has yet been written",
          404,
          "ERR_DNS_SCRIPT_NOT_FOUND"
        );
      }
    },
    updateHosts: {
      params: {
        hosts: "string"
      },
      handler: async ctx => {
        ctx.meta.$responseType = "text/plain";
        return await updateHosts({
          ...ctx.params,
          tempdir: `/tmp/pojntfx/provisioner/dns`
        });
      }
    },
    getHosts: async ctx => {
      ctx.meta.$responseType = "text/plain";
      const script = await getHosts(`/tmp/pojntfx/provisioner/dns`);
      if (script !== false) {
        return script;
      } else {
        throw new MoleculerError(
          "No hosts have yet been written",
          404,
          "ERR_HOSTS_NOT_FOUND"
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
              tempdir: "/tmp/pojntfx/provisioner/dns",
              name: "dnsmasq-dns"
            })
          : await stop("dnsmasq-dns")
    },
    getStatus: async () => await getStatus("dnsmasq-dns"),
    getLogs: async ctx => {
      ctx.meta.$responseType = "text/plain";
      const res = await getLogs("dnsmasq-dns");
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
    },
    getLookup: {
      params: {
        domain: "string",
        dnsServer: "string"
      },
      handler: async ctx => {
        ctx.meta.$responseType = "text/plain";
        return await getLookup(ctx.params);
      }
    }
  }
};
