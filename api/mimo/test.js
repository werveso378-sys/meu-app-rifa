const { getApps } = require('firebase-admin/app');

module.exports = async (req, res) => {
  const apps = getApps();
  if (apps.length > 0) {
    res.status(200).json({ projectId: apps[0].options.projectId, credentialInfo: !!apps[0].options.credential });
  } else {
    res.status(200).json({ error: "No apps initialized" });
  }
};
