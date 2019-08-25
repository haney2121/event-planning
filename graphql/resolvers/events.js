const Event = require('../../models/event');
const User = require('../../models/user');

const { transformEvent } = require('./merge');

module.exports = {
  events: async () => {
    let events = await Event.find({});
    let allEvents = events.map(event => {
      return transformEvent(event);
    });

    return allEvents;
  },
  createEvent: async (args, req) => {
    const { title, description, price, date } = args.eventInput;
    //checks if the user is logged in
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    //Mongoose model
    const event = new Event({
      title,
      description,
      price: +price,
      date: new Date(date),
      creator: '5d6215119507de19045291ec'
    });

    try {
      //saved the event with creator
      let addEvent = await event.save();

      //search user by id to save the event id to the user model
      let getUser = await User.findById('5d6215119507de19045291ec');
      //checking if user exist first
      if (!getUser) {
        throw new Error('No user exist');
      }
      //pushing the event id to the user array
      getUser.createdEvents.push(addEvent.id);
      //saving user
      await getUser.save();
      //returning the event for graphql with creator function at the top "user"
      return transformEvent(addEvent);
    } catch (e) {
      throw new Error(e.message);
    }
  },
  deleteEvent: async args => {
    const { id } = args;
    try {
      //finding event by id
      let eventToRemove = await Event.findById(id);
      //getting user that created the event by the eventid
      let eventCreator = await User.findById(eventToRemove.creator);

      //removing the event id from the createdEvent Array
      eventCreator.createdEvents.pop(eventToRemove.id);
      //saving the user with removed id
      eventCreator.save();
      //removing the event
      eventToRemove.remove();
      //returning the data for the removed event
      return eventToRemove;
    } catch (e) {
      throw new Error(e.message);
    }
  }
};
