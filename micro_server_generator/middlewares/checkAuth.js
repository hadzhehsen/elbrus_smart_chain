const checkAuth = (req, res, next) => {
  !req.session.wallet ? res.status(401) : next();
};

module.exports = { checkAuth };
