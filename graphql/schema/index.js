//function that a literal string to define a schema
const { buildSchema } = require('graphql');

module.exports = buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: User!
      }

      type Booking {
        _id: ID!
        event: Event!
        user: User!
        createdAt: String!
        updatedAt: String!
      }

      type User {
        _id: ID!
        email: String!
        password: String
        name: String!
        createdEvents: [Event!]
      }

      type AuthData {
        userId: ID!
        token: String!
        tokenExpiration: Int!
        name: String!
        email: String!
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      input UserInput {
        email: String!
        password: String
        name: String!
      }

      type RootQuery {
        events: [Event!]!
        users: [User!]!
        singleuser(email: String!): User!
        bookings: [Booking!]!
        login(email: String!, password: String!): AuthData!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
        deleteEvent(id: ID!): Event
        createUser(userInput: UserInput): User
        bookEvent(eventId: ID!): Booking!
        cancelBooking(bookingId: ID!): Event!
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `);
