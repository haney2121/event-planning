//Declare Express framework to setup server
const express = require('express');
//used in placed where express expects middleware, takes incoming request and forward to the graphql - Type Function
const graphqlHttp = require('express-graphql');
//function that a literal string to define a schema
const { buildSchema } = require('graphql');

//getting all bodies from incoming request
const bodyParser = require('body-parser');

//setup server
const app = express();

//converts the body to json
app.use(bodyParser.json());

//setting up api route with graphql middleware with the resolvers and schemas
app.use(
  '/graphql',
  graphqlHttp({
    schema: null,
    rootValue: {}
  })
);

//telling server to listen
app.listen(4001, () => {
  console.log(`Server is running on port 4001`);
});
