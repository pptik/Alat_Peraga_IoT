
const allowedOrigins = [/.*.pptik.id/];
require("dotenv").config();
const cors = (req, res, next) => {
  const requestHost = req.get("origin") || req.get("host");
  if (allowedOrigins.some((origin) => requestHost.match(origin))) {
    res.header("Access-Control-Allow-Origin", req.get("origin"));
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  next();
};

module.exports = {
  cors
};
