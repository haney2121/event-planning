//Declare Express framework to setup server
const express = require('express');
//used in placed where express expects middleware, takes incoming request and forward to the graphql - Type Function
const graphqlHttp = require('express-graphql');
//function that a literal string to define a schema
const { buildSchema } = require('graphql');
//connection to the Mongodb by using mongoose and Model
const mongoose = require('mongoose');
const Event = require('./models/event');

//getting all bodies from incoming request
const bodyParser = require('body-parser');

//setup server
const app = express();

const events = [];

//converts the body to json
app.use(bodyParser.json());

//setting up api route with graphql middleware with the resolvers and schemas
app.use(
  '/graphql',
  graphqlHttp({
    schema: buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      type RootQuery {
        events: [Event!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      events: async () => {
        let events = await Event.find({});
        return events;
      },
      createEvent: async args => {
        const { title, description, price, date } = args.eventInput;
        //Mongoose model
        const event = new Event({
          title,
          description,
          price: +price,
          date: new Date(date)
        });
        try {
          let addEvent = await event.save();
          console.log(addEvent);
          return addEvent;
        } catch (e) {
          console.log(e);
          throw new Error(e.message);
        }
      }
    },
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
