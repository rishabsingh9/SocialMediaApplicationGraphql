const{ApolloServer}=require('apollo-server');
const { PubSub } = require('graphql-subscriptions');
const mongoose=require('mongoose');

const typeDefs=require('./graphql/typeDefs');
const Post=require('./Models/Post');
const User=require('./Models/User');
const{MONGODB}=require('./config');
const resolvers=require('./graphql/resolvers')


const pubsub=new PubSub();


const server=new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req,pubsub })
})

mongoose.connect(MONGODB,{useNewUrlParser:true})
.then(()=>{
    console.log("Mongo Connected")
    return server.listen({port:3000})
})
.then(res=>{
    console.log(`server is running at ${res.url}`)
})
.catch((err)=>{
    console.log(err);
})