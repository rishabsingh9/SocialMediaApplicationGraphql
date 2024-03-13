const gql=require('graphql-tag');


module.exports=gql`

type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }
  type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }
  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }

input Registerinput{
    username:String!
    password:String!
    confirmPassword:String!
    email:String!
}

input LoginInput{
    username:String!
    password:String!
}

type User{
    id:ID!,
    username:String!,
    token:String!,
    email:String!,
    createdAt:String!,
    followers: [ID!]!,
  following: [ID!]!,
  saved:[ID!]!
}

# type Post{
#     id:ID!
#     username:String!
#     body:String!
#     createdAt:String!
# }



type Query{
    getPosts:[Post!]!
    getPost(postId:String!):Post!
    getAllMyPosts:[Post!]!
}

type Mutation{
    register(registerInput:Registerinput):User!
    login(loginInput:LoginInput):User!
    createPost(body: String!): Post!
    deleteMyPost(postId:ID!):String!
    likePost(postId:ID!):Post!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    follow(userId: ID!): User!
    unfollow(userId:ID!):User!
    savePost(postId:ID!):User!
    unsavePost(postId:ID!):User!
    
}
type Subscription {
    newPost: Post!
  }
`