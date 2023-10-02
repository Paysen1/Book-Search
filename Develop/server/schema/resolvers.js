const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (_, __, context) => {
            if (context.user) {
                const user = await User.findOne({ _id: context.user._id });
                return user;
              }
              return null;
        }
    },
    Mutation: {
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
              throw new Error("Can't find this user");
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
              throw new Error('Wrong password!');
            }
            const token = signToken(user);
            return { token, user };
          },
          addUser: async (_, args) => {
            const user = await User.create(args);
            if (!user) {
              throw new Error('Something is wrong!');
            }
            const token = signToken(user);
            return { token, user };
          },
          saveBook: async (_, { user, body }) => {
            try {
              const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $addToSet: { savedBooks: body } },
                { new: true, runValidators: true }
              );
              return updatedUser;
            } catch (err) {
              throw err;
            }
          },
          removeBook: async (_, { user, params }) => {
            const updatedUser = await User.findOneAndUpdate(
              { _id: user._id },
              { $pull: { savedBooks: { bookId: params.bookId } } },
              { new: true }
            );
            if (!updatedUser) {
              throw new Error("Couldn't find user with this id!");
            }
            return updatedUser;
          },
        },
      };

      module.exports = resolvers;