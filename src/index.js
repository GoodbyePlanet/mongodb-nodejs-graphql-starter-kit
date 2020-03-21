require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const { notFound, errorHandler } = require('./middlewares');
const {
  app: { port },
} = require('../config').get(process.env.NODE_ENV);
const db = require('./db');
const apolloServer = require('./graphqlRoute');
const {
  verifyToken,
  generateAccessToken,
} = require('./accessControl/accessControl');
const LOGGER = require('./logger/logger');

const app = express();

// TODO: Check HELMET => https://www.npmjs.com/package/helmet

db.connect();

app.use(cookieParser());

app.get('/', async (_, res) => {
  res.json({ message: 'THIS IS THE INITAL ROUTE' });
});

app.post('/refresh-token', (req, res) => {
  const refreshToken = req.cookies['refresh-token'];

  if (!refreshToken) {
    res.status(401).send({ ok: false, accessToken: '' });
  }

  try {
    const payload = verifyToken(refreshToken, false);

    res.status(201).send({
      ok: true,
      accessToken: generateAccessToken({ _id: payload.id }),
    });
  } catch (error) {
    LOGGER.error('Error occurred while verifying refresh token', error);
    res.status(401).send({ ok: false, accessToken: '' });
  }
});

apolloServer.applyMiddleware({ app });

app.use(notFound);
app.use(errorHandler);

db.connection.on('connected', () => {
  app.listen(port, () =>
    console.log(
      `Listening at http://localhost:${port}${apolloServer.graphqlPath}`,
    ),
  );
});
