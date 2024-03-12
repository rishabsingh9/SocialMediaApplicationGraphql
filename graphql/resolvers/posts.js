const { AuthenticationError } = require('apollo-server');
const Post=require('../../Models/Post');
const{USER_KEY,USER_SECRET}=require('../../config');
const checkAuth=require('../../util/check-auth');


module.exports={
    
Query:{
    async  getPosts(){
      try{
          const posts=await Post.find().sort({createdAt:-1});
          return posts;
      }
      catch(err){
          throw new Error(err);
      }
      },
      async getPost(_, { postId }) {
        try {
          const post = await Post.findById(postId);
          if (post) {
            return post;
          } else {
            throw new Error('Post not found');
          }
        } catch (err) {
          throw new Error(err);
        }
      },
      async getAllMyPosts(_,{},context){
      //  console.log(context)
        try {
            const user=checkAuth(context);
            const username=user.username;
            const myPosts=Post.find({username}).sort({createdAt:-1});
            return myPosts;
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
      }
  },
  Mutation:{
    async createPost(_,{body},context){
        try {
            const user=checkAuth(context);
            console.log(user);
            const newPost=new Post({
                body,
                user:user.id,
                username:user.username,
                createdAt:new Date().toISOString()

            })
            const post=await newPost.save();
            return post;
        } catch (error) {
            throw new Error(error);
        }
    },
    async deleteMyPost(_,{postId},context){
        const user=checkAuth(context);
        try {
            console.log(postId)
            const post=await Post.findById(postId);
            console.log(post.username,user)
            if(user.username===post.username){
                await post.deleteOne();
                return "post deleted successfully";
            }
            else{
                throw new AuthenticationError("action not allowed")  
            }
        } catch (error) {
            throw new Error(error);
        }

    }
    }
}