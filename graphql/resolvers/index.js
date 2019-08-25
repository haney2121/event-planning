const authResolver = require('./auth');
const bookingResolver = require('./booking');
const eventResolver = require('./events');

const graphqlResolvers = {
  ...authResolver,
  ...bookingResolver,
  ...eventResolver
};

module.exports = graphqlResolvers;
