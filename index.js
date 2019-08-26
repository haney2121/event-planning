//Declare Express framework to setup server
const express = require('express');
//used in placed where express expects middleware, takes incoming request and forward to the graphql - Type Function
const graphqlHttp = require('express-graphql');
//connection to the Mongodb by using mongoose and Model
const mongoose = require('mongoose');
const isAuth = require('./middleware/isAuth');

const graphqlSchema = require('./graphql/schema/');
const graphqlResolvers = require('./graphql/resolvers/');

//getting all bodies from incoming request
const bodyParser = require('body-parser');
//setup server
const app = express();

//converts the body to json
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

//setting up api route with graphql middleware with the resolvers and schemas
app.use(
  '/graphql',
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
  })
);

//connecting to the db before starting the server
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@event-planning-vex97.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true }
  )
  .then(() => {
    //telling server to listen
    app.listen(4001, () => {
      console.log(`Server is running on port 4001`);
    });
  })
  .catch(e => {
    console.log(e);
  });
