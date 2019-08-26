const User = require('../../models/user');
const jwt = require('jsonwebtoken');

//hashing the password with bcrypt
const bcrypt = require('bcryptjs');

const { events } = require('./merge');

module.exports = {
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
  login: async args => {
    const { email, password } = args;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error('Invalid Username!');
    }
    let isValid = await bcrypt.compare(password, user.password);
    console.log(isValid);
    if (!isValid) {
      throw new Error('Invalid Password!');
    }
    const token = await jwt.sign(
      { userId: user.id, name: user.name, email: user.email },
      `${process.env.AUTH_SECRET}`,
      { expiresIn: '1h' }
    );
    return {
      userId: user.id,
      token: token,
      tokenExpiration: 1,
      name: user.name,
      email: user.email
    };
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
  }
};
