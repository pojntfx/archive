const Gateway = require("moleculer-web");
const localtunnel = require("localtunnel");

module.exports = {
  name: "gateway",
  mixins: [Gateway],
  settings: {
    routes: [
      {
        whitelist: [
          "bootmedia.create",
          "bootmedia.list",
          "bootmedia.get",
          "bootmedia.delete",
          "dnsmasq.set",
          "dnsmasq.get",
          "dnsmasq.setStatus",
          "dnsmasq.getStatus",
          "dnsmasq.logs",
          "dnsmasq.interfaces",
          "ipxescripts.*",
          "preseeds.*",
          "postseeds.*",
          "gateway.expose",
          "gateway.unexpose"
        ],
        aliases: {
          // bootmedia
          "POST bootmedia": "bootmedia.create",
          "GET bootmedia": "bootmedia.list",
          "GET bootmedia/:id": "bootmedia.get",
          "DELETE bootmedia/:id": "bootmedia.delete",
          // pxeboot
          "PUT pxeboot": "dnsmasq.set",
          "GET pxeboot": "dnsmasq.get",
          "PUT pxeboot/status": "dnsmasq.setStatus",
          "GET pxeboot/status": "dnsmasq.getStatus",
          "GET pxeboot/logs": "dnsmasq.logs",
          "GET pxeboot/interfaces": "dnsmasq.interfaces",
          "REST pxeboot/mainscripts": "ipxescripts",
          "REST pxeboot/preseeds": "preseeds",
          "REST pxeboot/postseeds": "postseeds"
          // Doesn't work?
          // - Have you whitelisted the service above?
          // - Try restarting the container
          // (keep this note here to prevent pain)
        }
      }
    ]
  },
  actions: {
    expose: {
      params: {
        subdomain: "string"
      },
      handler: ctx => {
        const that = this;
        return new Promise(async function(resolve) {
          const nodes = await ctx.call("$node.list");
          const localNode = nodes.find(node => node.local);
          localtunnel(
            3000,
            {
              subdomain: ctx.params.subdomain
            },
            function(_, tunnel) {
              that[`${tunnel.url}-${localNode.id}`] = tunnel;
              resolve({
                domain: tunnel.url,
                nodeId: localNode.id
              });
            }
          );
        });
      }
    },
    unexpose: {
      params: {
        domain: "string",
        nodeId: "string"
      },
      handler: async ctx => {
        const tunnel = this[`${ctx.params.domain}-${ctx.params.nodeId}`];
        await tunnel.close();
        return {
          domain: ctx.params.domain,
          nodeId: ctx.params.nodeId
        };
      }
    }
  }
};
