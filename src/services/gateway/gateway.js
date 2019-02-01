const Gateway = require("moleculer-web");

module.exports = {
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
          "postseeds.*"
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
  }
};
