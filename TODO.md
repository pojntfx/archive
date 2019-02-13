# Felicitas Pojtinger's Provisioner TODO

- Fix `pxeboot` and `build` services by pushing the artifacts into an S3 bucket and then fetching them later (using a queue; every build service is simply a queue worker, not a streaming microservice)
  1. POST /mainscripts (w/ JSON body) => Build with script in queue => ID to object with URLs
  2. PUT /current (w/ JSON body ID) => Copy to TFTPRoot etc. by ID => ID to object with URLs => fetch from S3
