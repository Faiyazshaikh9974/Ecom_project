import mongoose from "mongoose";

const contactSchema=mongoose.Schema({
      name:{
            type:String,

      },
      email:{type:String,unique:true},
      phone:{type:String,unique:true}

})

export const Contact=mongoose.model('Contact',contactSchema);