const {model,Schema}=require('mongoose');

const userSchema=new Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    createdAt:String,
    followers: [{type: Schema.Types.ObjectId, ref: 'user'}],
    following: [{type: Schema.Types.ObjectId, ref: 'user'}],
    saved: [{type: Schema.Types.ObjectId, ref: 'user'}]
})

// const userSchema = new Schema({
//     username: String,
//     password: String,
//     email: String,
//     createdAt: String
//   });

module.exports=model('user',userSchema);