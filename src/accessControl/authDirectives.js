require('dotenv').config();

const {
  auth: { accessToken },
} = require('../../config').get(process.env.NODE_ENV);
const { createAuthDirectives } = require('gql-auth-directives');
const { AuthenticationError } = require('../validation/AuthErrors');
const { verifyToken } = require('./accessControl');

const authDirectives = createAuthDirectives({
  isAuthenticatedHandler: ({ req }) => {
    const authorization = req.headers['authorization'];

    if (!authorization) {
      throw new AuthenticationError();
    }

    try {
      const token = authorization.split(' ')[1];
      const payload = verifyToken(token, true);
      req.developerId = payload.id;
    } catch (error) {
      throw new AuthenticationError();
    }
  },
});

module.exports = { authDirectives };
