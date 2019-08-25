const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');
//hashing the password with bcrypt
const bcrypt = require('bcryptjs');

const dateConvert = require('../../helpers/index');
const transformEvent = require('../../helpers/index');
//nested functions for graphql with mongodb
const user = async userId => {
  try {
    let user = await User.findById(userId);
    return {
      ...user._doc,
      createdEvents: events.bind(this, user.createdEvents)
    };
  } catch (e) {
    throw new Error(e.message);
  }
};

const events = async eventIds => {
  try {
    //finding all events within the group of ids with special in
    let events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => {
      return transformEvent(event);
    });
  } catch (e) {
    throw new Error(e.message);
  }
};

const oneEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    return transformEvent(event);
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = {
  events: async () => {
    let events = await Event.find({});
    let allEvents = events.map(event => {
      return transformEvent(event);
    });

    return allEvents;
  },
  users: async () => {
    let users = await User.find({});
    let allUsers = users.map(user => {
      return {
        ...user._doc,
        password: null,
        createdEvents: events.bind(this, user.createdEvents)
      };
    });
    return allUsers;
  },
  singleuser: async args => {
    const { email } = args;
    try {
      let user = await User.findOne({ email: email });
      user.password = null;
      return user;
    } catch (e) {
      throw new Error(e.message);
    }
  },
  bookings: async () => {
    try {
      let allBookings = await Booking.find();
      return allBookings.map(booking => {
        return {
          ...booking._doc,
          createdAt: dateConvert(booking.createdAt),
          updatedAt: dateConvert(booking.updatedAt),
          user: user.bind(this, booking.user),
          event: oneEvent.bind(this, booking.event)
        };
      });
    } catch (e) {
      throw new Error(e.message);
    }
  },
  createEvent: async args => {
    const { title, description, price, date } = args.eventInput;
    try {
      //Mongoose model
      const event = new Event({
        title,
        description,
        price: +price,
        date: new Date(date),
        creator: '5d6215119507de19045291ec'
      });
      //saved the event with creator
      let addEvent = await event.save();

      //search user by id to save the event id to the user model
      let getUser = await User.findById('5d6215119507de19045291ec');
      console.log(getUser);
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
  },
  createUser: async args => {
    const { email, name, password } = args.userInput;
    try {
      //checking for existing user
      let currentUserExist = await User.findOne({ email: email });

      if (currentUserExist) {
        throw new Error('User exists already.');
      }

      let hashPassword = await bcrypt.hash(password, 12);
      const user = new User({
        name,
        email,
        password: hashPassword
      });

      let savedUser = await user.save();
      //prevents hash from being sent to the frontend
      savedUser.password = null;
      return savedUser;
    } catch (e) {
      throw new Error(e.message);
    }
  },
  bookEvent: async args => {
    const { eventId } = args;
    //searching if event exist
    const fetchingEvent = await Event.findOne({ _id: eventId });
    const booking = new Booking({
      user: '5d6215119507de19045291ec',
      event: fetchingEvent
    });
    const savedBooking = await booking.save();
    return {
      ...savedBooking._doc,
      event: oneEvent.bind(this, savedBooking.event),
      user: user.bind(this, booking.user),
      createdAt: dateConvert(savedBooking.createdAt),
      updatedAt: dateConvert(savedBooking.updatedAt)
    };
  },
  cancelBooking: async args => {
    const { bookingId } = args;
    const getBooking = await Booking.findOne({ _id: bookingId });
    if (!getBooking) {
      throw new Error('The booking you are looking for does not exist.');
    }
    const fetchingEvent = await Event.findOne({ _id: getBooking.event });
    await getBooking.remove();
    return transformEvent(fetchingEvent);
  }
};
