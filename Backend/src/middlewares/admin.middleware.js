// Admin middleware — auth.middleware ke baad lagao
// Pehle JWT verify hoga, phir admin check hoga

const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

module.exports = isAdmin;