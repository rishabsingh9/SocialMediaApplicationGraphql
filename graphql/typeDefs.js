const gql=require('graphql-tag');


module.exports=gql`

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
    createdAt:String!
}

type Post{
    id:ID!
    username:String!
    body:String!
    createdAt:String!
}
type Query{
    getPosts:[Post!]!
}

type Mutation{
    register(registerInput:Registerinput):User!
    login(loginInput:LoginInput):User!
}
`