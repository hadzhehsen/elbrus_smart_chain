const checkAuth = (req, res, next) => {
  !req.session.wallet ? res.send.status(401) : next();
};

module.exports = { checkAuth };
