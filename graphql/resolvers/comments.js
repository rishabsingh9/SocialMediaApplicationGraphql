const Post=require('../../Models/Post');
const {UserInputError}=require('apollo-server');
const checkAuth=require('../../util/check-auth');


module.exports={
    Mutation:{
        async createComment(_,{postId,body},context){
            try {
                const{username}=checkAuth(context);
                if(body.trim()===''){
                    throw new UserInputError("Empty Comment",{
                        errors:{
                            body:"Add a comment"
                        }
                    })
                }

                const post=await Post.findById(postId);
                console.log("post",post)
                if(post){
                    post.comments.unshift({
                        body,
                        username,
                        createdAt:new Date().toISOString()
                    })

                    await post.save();
                    return post;
                }
                else{
                    throw new UserInputError("post not found");
                }
            } catch (error) {
                throw new Error(error);
            }
        },
        async deleteComment(_, { postId, commentId }, context) {
            const { username } = checkAuth(context);
      
            const post = await Post.findById(postId);
      
            if (post) {
              const commentIndex = post.comments.findIndex((c) => c.id === commentId);
      
              if (post.comments[commentIndex].username === username) {
                post.comments.splice(commentIndex, 1);
                await post.save();
                return post;
              } else {
                throw new AuthenticationError('Action not allowed');
              }
            } else {
              throw new UserInputError('Post not found');
            }
          }
    }
}