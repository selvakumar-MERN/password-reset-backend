const mongoose= require('mongoose')
const usersSchema= new mongoose.Schema({
    firstName:{
        type: String,
        required:true,
        min:3,
        max:25,
    },
    lastName:{
        type: String,
        required:true,
        min:3,
        max:25,
    },
    email:{
        type: String,
        required:true,
        min:6,
        max:50,
    },
    password:{
        type: String,
        required:true,
        min:8,
        max:25,
    },
    confirmpassword:{
          type:String,
          required:true,
          min:8,
          max:25,
    },
    tokencode:{
           type:String,
           required:false,
           
    },
    date:{
        type:Date,
        default:Date.now(),
    },
    
});
module.exports=mongoose.model("userData",usersSchema)