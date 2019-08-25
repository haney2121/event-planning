const Event = require('../../models/event');
const User = require('../../models/user');

const { dateConvert } = require('../../helpers/date');

const transformBooking = booking => {
  return {
    ...booking._doc,
    event: oneEvent.bind(this, booking.event),
    user: user.bind(this, booking.user),
    createdAt: dateConvert(booking.createdAt),
    updatedAt: dateConvert(booking.updatedAt)
  };
};

const transformEvent = event => {
  return {
    ...event._doc,
    date: dateConvert(event.date),
    creator: user.bind(this, event.creator)
  };
};

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

exports.user = user;
exports.events = events;
exports.oneEvent = oneEvent;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
