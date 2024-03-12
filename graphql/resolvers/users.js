const User = require("../../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../../config");
const { UserInputError } = require("apollo-server");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../validators");
const checkAuth = require("../../util/check-auth");

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
    async follow(_,{userId},context){
      const returnedUser=checkAuth(context);
      const id=returnedUser.id;
      console.log("id",id);
      const user=await User.findById(id);
      console.log(user,user._id);

      const userToFollow=await User.findById(userId);
      if (!userToFollow) {
        throw new Error('User not found');
      }
      console.log(userToFollow);
      if (!userToFollow.followers.includes(user._id)) {
        userToFollow.followers.push(user._id);
        await userToFollow.save();
      }
      else{
        throw new Error("Already Followed")
      }
      if (!user.following.includes(userToFollow._id)) {
        user.following.push(userToFollow._id);
        await user.save();
      }
      else{
        throw new Error("Already in following")
      }

      return userToFollow;

    },
    // async unfollow(_,{userId},context){
    //   const returnedUser=checkAuth(context);
    //   const user=await User.findById(returnedUser.id);
      
    //   const toUnfollow=await User.findById(userId);
    //   if (!toUnfollow) {
    //     throw new Error('User not found');
    //   }

    //   if(user.following.includes(toUnfollow._id)){
    //     const updatedFollowing=user.following.filter(follower=>follower._id!==userId);
    //     await updatedFollowing.save();
    //   }

    //   if(toUnfollow.followers.includes(user._id)){
    //     const updatedFollowers=toUnfollow.following.filter(curr=>curr._id!==user._id);
    //     await updatedFollowers.save();
    //   }
    //   return updatedFollowing;
    // }
    async unfollow(_, { userId }, context) {
      const returnedUser = checkAuth(context);
      const user = await User.findById(returnedUser.id);
      const toUnfollow = await User.findById(userId);
    
      if (!toUnfollow) {
        throw new Error('User not found');
      }
    
      let updatedFollowing = user.following.filter(followerId => followerId!== userId);
      user.following = updatedFollowing;
      await user.save();
    
      let updatedFollowers = toUnfollow.followers.filter(followerId => followerId !== returnedUser.id);
      toUnfollow.followers = updatedFollowers;
      await toUnfollow.save();
    
      return toUnfollow; // Assuming you want to return the updated following list
    }
  },
};

// module.exports = {
//   Mutation: {
//     async login(_, {loginInput:{username,password}}) {
//       const { isvalid, errors } = validateLoginInput(username, password);
//       if (!isvalid) {
//         throw new UserInputError("Error", { errors });
//       }
//       const user = await User.findOne({ username });
//       if (!user) {
//         errors.general = "User doesn't exist";
//         throw new UserInputError("Errors", { errors });
//       }

//       const passwordMatching=await bcrypt.compare(password,user.password);
//       if(!passwordMatching){
//         errors.general='wrong password'
//         throw new UserInputError("Error",{errors});
//       }
//       const token=generateAccessToken(user);

//       return {
//         ...user._doc,
//         id: user._id,
//         token
//       };
//     },
//   },
// };
