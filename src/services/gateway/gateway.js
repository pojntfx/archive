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
          "gateway.list",
          "gateway.delete"
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
          "GET tunnels": "gateway.list",
          "DELETE tunnels/:id": "gateway.delete"
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
                  that[`TUNNEL_${tunnel.url}`] = tunnel;
                  const tunnelInDB = await this.actions.create({
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
    delete: {
      params: {
        id: "string"
      },
      handler: async function(ctx) {
        try {
          const tunnelInDb = await this.actions.remove({
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
    }
  }
};
