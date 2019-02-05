const Gateway = require("moleculer-web");
const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const Sequelize = require("sequelize");
const localtunnel = require("localtunnel");
const { MoleculerError } = require("moleculer").Errors;

const routes = [
  {
    path: "/api",
    whitelist: [
      // dns
      "dns.updateScript",
      "dns.getScript",
      "dns.updateHosts",
      "dns.getHosts",
      "dns.updateStatus",
      "dns.getStatus",
      "dns.getLogs",
      "dns.getInterfaces",
      "dns.getPorts",
      "dns.getLookup",
      // tunnels
      "gateway.createTunnel",
      "gateway.listTunnels",
      "gateway.removeTunnel",
      // bootmedia
      "bootmedia.create",
      "bootmedia.list",
      "bootmedia.get",
      "bootmedia.remove",
      // pxeboot
      "pxeboot.updateScript",
      "pxeboot.getScript",
      "subscripts.*",
      "kickstarts.*",
      "preinstallscripts.*",
      "postinstallscripts.*",
      "pxeboot.updateStatus",
      "pxeboot.getStatus",
      "pxeboot.getLogs",
      "pxeboot.getInterfaces",
      "pxeboot.getPorts"
    ],
    aliases: {
      // dns
      "PUT dns/script": "dns.updateScript",
      "GET dns/script": "dns.getScript",
      "PUT dns/hosts": "dns.updateHosts",
      "GET dns/hosts": "dns.getHosts",
      "PUT dns/status": "dns.updateStatus",
      "GET dns/status": "dns.getStatus",
      "GET dns/logs": "dns.getLogs",
      "GET dns/interfaces": "dns.getInterfaces",
      "GET dns/ports": "dns.getPorts",
      "GET dns/lookup": "dns.getLookup",
      // tunnels
      "POST tunnels": "gateway.createTunnel",
      "GET tunnels": "gateway.listTunnels",
      "DELETE tunnels/:id": "gateway.removeTunnel",
      // bootmedia
      "POST bootmedia": "bootmedia.create",
      "GET bootmedia": "bootmedia.list",
      "GET bootmedia/:id": "bootmedia.get",
      "DELETE bootmedia/:id": "bootmedia.remove",
      // pxeboot
      "PUT pxeboot/mainscript": "pxeboot.updateScript",
      "GET pxeboot/mainscript": "pxeboot.getScript",
      "REST pxeboot/subscripts": "subscripts",
      "REST pxeboot/kickstarts": "kickstarts",
      "REST pxeboot/preinstallscripts": "preinstallscripts",
      "REST pxeboot/postinstallscripts": "postinstallscripts",
      "PUT pxeboot/status": "pxeboot.updateStatus",
      "GET pxeboot/status": "pxeboot.getStatus",
      "GET pxeboot/logs": "pxeboot.getLogs",
      "GET pxeboot/interfaces": "pxeboot.getInterfaces",
      "GET pxeboot/ports": "pxeboot.getPorts"
    }
  }
];

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
    routes
  },
  actions: {
    createTunnel: {
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
    listTunnels: async ctx => {
      const tunnels = await ctx.call("gateway.list");
      const tunnelsThatDontExistAnymore = [];

      for (tunnel of tunnels.rows) {
        if (
          !(await ctx.call(
            "gateway.tryToFindTunnel",
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
    removeTunnel: {
      params: {
        id: "string"
      },
      handler: async ctx => {
        try {
          const tunnelInDb = await ctx.call("gateway.remove", {
            id: ctx.params.id
          });

          await ctx.call(
            "gateway.closeTunnel",
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
    closeTunnel: {
      params: {
        domain: "string"
      },
      handler: async function(ctx) {
        const tunnel = this[`TUNNEL_${ctx.params.domain}`];
        return await tunnel.close();
      }
    },
    tryToFindTunnel: {
      params: {
        domain: "string"
      },
      handler: async function(ctx) {
        return this.hasOwnProperty(`TUNNEL_${ctx.params.domain}`);
      }
    }
  }
};
