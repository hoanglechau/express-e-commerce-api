const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    espiresIn: process.env.JWT_LIFETIME
  });
  return token;
};

const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user });

  const oneDay = 1000 * 60 * 60 * 24;
  // Save the token in the browser cookies (instead of Local Storage)
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay)
  });
};

module.exports = { createJWT, isTokenValid, attachCookiesToResponse };
