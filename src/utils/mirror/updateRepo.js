const { init } = require("./init");
const { getSources } = require("./getSources");
const { config } = require("./config");
const { getUpstream } = require("./getUpstream");
const { configBucket } = require("./configBucket");
const { publishToBucket } = require("./publishToBucket");
const { exposeBucket } = require("./exposeBucket");
const { cleanCache: cleanCacheFn } = require("./cleanCache");

module.exports.updateRepo = async ({
  remote,
  skipDownload,
  cleanCache,
  username,
  password,
  s3Endpoint,
  tempdir,
  id
}) => {
  const outdir = `${tempdir}/out`;
  const logpath = `${tempdir}/log/${id}`;
  const logfile = `${logpath}/log`;
  const timefile = `${tempdir}/time`;
  const srcdir = `${tempdir}/src`;
  const configfile = `${srcdir}/quick-fedora-mirror.conf`;
  await init(outdir, logpath, logfile, timefile, srcdir);
  if (cleanCache) {
    cleanCacheFn(outdir);
  }
  if (!skipDownload) {
    await getSources(srcdir);
    await config(configfile, outdir, timefile, remote, logfile);
    await getUpstream(srcdir, configfile);
  }
  await configBucket(s3Endpoint, username, password);
  await publishToBucket(outdir);
  return await exposeBucket();
};
