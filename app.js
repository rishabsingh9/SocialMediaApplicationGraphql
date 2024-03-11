const{ApolloServer}=require('apollo-server');
const mongoose=require('mongoose');

const typeDefs=require('./graphql/typeDefs');
const Post=require('./Models/Post');
const User=require('./Models/User');
const{MONGODB}=require('./config');
const resolvers=require('./graphql/resolvers')




const server=new ApolloServer({
    typeDefs,
    resolvers
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