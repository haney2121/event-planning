const Event = require('../../models/event');
const Booking = require('../../models/booking');
// const User = require('../../models/user');

const { transformEvent, transformBooking } = require('./merge');

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('You need to be logged in!');
    }
    try {
      //find all bookings
      let allBookings = await Booking.find();
      //returning a new array of booking with the modified data using the transformbooking function in merge.js
      return allBookings.map(booking => {
        //overwrites the date to use iso and also allows data to be pulled in from the other collections
        return transformBooking(booking);
      });
    } catch (e) {
      throw new Error(e.message);
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('You need to be logged in!');
    }
    const { eventId } = args;
    //searching if event exist
    const fetchingEvent = await Event.findOne({ _id: eventId });
    const booking = new Booking({
      user: '5d6215119507de19045291ec',
      event: fetchingEvent
    });
    const savedBooking = await booking.save();
    return transformBooking(savedBooking);
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('You need to be logged in!');
    }
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
