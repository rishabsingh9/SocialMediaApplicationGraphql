const userResolver=require('./users');
const postResolver=require('./posts');
const commentsResolver=require('./comments');

module.exports={
    Post: {
        likeCount: (parent) => parent.likes.length,
        commentCount: (parent) => parent.comments.length
      },
    Query:{
        ...postResolver.Query
    },
    Mutation:{
        ...userResolver.Mutation,
        ...postResolver.Mutation,
        ...commentsResolver.Mutation
    },
    Subscription: {
        ...postResolver.Subscription
      }
}