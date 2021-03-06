const { ApolloServer } = require('apollo-server-express');
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas');
const path = require('path');
const { authDirectives } = require('./accessControl/authDirectives');

// fileLoader is function for importing all files from specified folder
// path.join(__dirname, './schemas')
// Users/nemanjavasic/Documents/NODEJS/mongodb-nodejs-graphql-starter-kit/src/schemas

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schemas')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    ...authDirectives,
  },
  context: ({ req, res }) => ({ req, res }),
});

module.exports = apolloServer;
