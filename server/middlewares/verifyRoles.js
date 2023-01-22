const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401);
    const rolesArray = [...allowedRoles];
    console.log(rolesArray);
    console.log(req.roles);
    const isAuthorized = req.roles
      .map((roles) => rolesArray.includes(roles))
      .find((val) => val === true);
    if (!isAuthorized) return res.sendStatus(401);
    next();
  };
};

module.exports = verifyRoles;
