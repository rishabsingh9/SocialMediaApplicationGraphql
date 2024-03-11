const userResolver=require('./users');
const postResolver=require('./posts');

module.exports={
    Query:{
        ...postResolver.Query
    },
    Mutation:{
        ...userResolver.Mutation
    }
}