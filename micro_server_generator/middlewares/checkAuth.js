const checkAuth = (req, res, next) => {
  if (req.session.wallet) res.status(401);
  else next();
};

module.exports = { checkAuth };
