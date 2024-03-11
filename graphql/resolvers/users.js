const User = require("../../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../../config");
const { UserInputError } = require("apollo-server");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../validators");

async function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
}
module.exports = {
  Mutation: {
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Error", { errors });
      }
      let user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("user already exits", {
          errors: {
            username: "username not available",
          },
        });
      }
      user = await User.findOne({ email });
      if (user) {
        throw new UserInputError("email already exits", {
          errors: {
            email: "email already exists",
          },
        });
      }

      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        username,
        email,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();
      console.log(res);
      const token=generateAccessToken(res)

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};

module.exports = {
  Mutation: {
    async login(_, {loginInput:{username,password}}) {
      const { isvalid, errors } = validateLoginInput(username, password);
      if (!isvalid) {
        throw new UserInputError("Error", { errors });
      }
      const user = await User.findOne({ username });
      if (!user) {
        errors.general = "User doesn't exist";
        throw new UserInputError("Errors", { errors });
      }

      const passwordMatching=await bcrypt.compare(password,user.password);
      if(!passwordMatching){
        errors.general='wrong password'
        throw new UserInputError("Error",{errors});
      }
      const token=generateAccessToken(user);

      return {
        ...user._doc,
        id: user._id,
        token
      };
    },
  },
};
