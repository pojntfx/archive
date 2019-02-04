const { updateScript } = require("../../utils/dns/updateScript");
const { getScript } = require("../../utils/dns/getScript");
const { updateHosts } = require("../../utils/dns/updateHosts");
const { getHosts } = require("../../utils/dns/getHosts");
const { getPorts } = require("../../utils/dns/getPorts");
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
          tempdir: `/tmp/pojntfx/os/dns`
        });
      }
    },
    getScript: async ctx => {
      ctx.meta.$responseType = "text/plain";
      const script = await getScript(`/tmp/pojntfx/os/dns`);
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
          tempdir: `/tmp/pojntfx/os/dns`
        });
      }
    },
    getHosts: async ctx => {
      ctx.meta.$responseType = "text/plain";
      const script = await getHosts(`/tmp/pojntfx/os/dns`);
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
    getPorts: async ctx => {
      ctx.meta.$responseType = "text/plain";
      return await getPorts();
    }
  }
};
