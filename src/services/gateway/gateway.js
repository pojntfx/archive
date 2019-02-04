const Gateway = require("moleculer-web");
const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const Sequelize = require("sequelize");
const localtunnel = require("localtunnel");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
  name: "gateway",
  mixins: [Gateway, DbService],
  adapter: new SqlAdapter(process.env.GATEWAY_DB_URI),
  model: {
    name: "localtunnel",
    define: {
      domain: Sequelize.STRING,
      nodeId: Sequelize.STRING
    }
  },
  settings: {
    entityValidator: {
      domain: "string",
      nodeId: "string"
    },
    cors: {
      origin: "*",
      methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
      allowedHeaders: [],
      exposedHeaders: [],
      credentials: false,
      maxAge: 3600
    },
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
          "gateway.getAll",
          "gateway.delete",
          "dns.updateScript",
          "dns.getScript",
          "dns.getPorts"
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
          "REST pxeboot/postseeds": "postseeds",
          "POST tunnels": "gateway.expose",
          "GET tunnels": "gateway.getAll",
          "DELETE tunnels/:id": "gateway.delete",
          "PUT dns/script": "dns.updateScript",
          "GET dns/script": "dns.getScript",
          "GET dns/ports": "dns.getPorts"
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
      handler: async function(ctx) {
        const that = this;
        if (ctx.params.subdomain.includes(".")) {
          throw new MoleculerError(
            'The subdomain must not include an invalid character such as "."',
            422,
            "ERR_INVALID_SUBDOMAIN"
          );
        } else {
          try {
            return new Promise(async (resolve, reject) => {
              const nodes = await ctx.call("$node.list");
              const localNode = nodes.find(node => node.local);
              localtunnel(
                3000,
                {
                  subdomain: ctx.params.subdomain
                },
                async (err, tunnel) => {
                  if (err) {
                    reject(err);
                  }
                  tunnel.on("error", err =>
                    this.logger.error(`localtunnel error: ${err}`)
                  );
                  that[`TUNNEL_${tunnel.url}`] = tunnel;
                  const tunnelInDB = await ctx.call("gateway.create", {
                    domain: tunnel.url,
                    nodeId: localNode.id
                  });
                  resolve(tunnelInDB);
                }
              );
            });
          } catch (e) {
            throw new MoleculerError(
              "The tunnel could not be created",
              503,
              "ERR_TUNNEL_CREATION_NOT_WORKING"
            );
          }
        }
      }
    },
    getAll: async ctx => {
      const tunnels = await ctx.call("gateway.list");
      const tunnelsThatDontExistAnymore = [];

      for (tunnel of tunnels.rows) {
        if (
          !(await ctx.call(
            "gateway.tunnelExists",
            {
              domain: tunnel.domain
            },
            {
              nodeId: tunnel.nodeId
            }
          ))
        ) {
          tunnelsThatDontExistAnymore.push(tunnel);
        }
      }

      for (tunnel of tunnelsThatDontExistAnymore) {
        await ctx.call("gateway.remove", {
          id: tunnel.id
        });
      }

      return await ctx.call("gateway.list");
    },
    delete: {
      params: {
        id: "string"
      },
      handler: async ctx => {
        try {
          const tunnelInDb = await ctx.call("gateway.remove", {
            id: ctx.params.id
          });

          await ctx.call(
            "gateway.unexpose",
            {
              domain: tunnelInDb.domain,
              nodeId: tunnelInDb.nodeId
            },
            {
              nodeId: tunnelInDb.nodeId
            }
          );
          return tunnelInDb;
        } catch (e) {
          throw new MoleculerError(
            "This tunnel could not be found",
            404,
            "ERR_TUNNEL_NOT_FOUND"
          );
        }
      }
    },
    unexpose: {
      params: {
        domain: "string"
      },
      handler: async function(ctx) {
        const tunnel = this[`TUNNEL_${ctx.params.domain}`];
        return await tunnel.close();
      }
    },
    tunnelExists: {
      params: {
        domain: "string"
      },
      handler: async function(ctx) {
        return this.hasOwnProperty(`TUNNEL_${ctx.params.domain}`);
      }
    }
  }
};
