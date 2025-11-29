import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
      name:{type:String,required:true},
      price:{type:Number,required:true},
      product_Image:{type:String,required:true},
      description:{type:String,required:true},
      rating:{type:String,required:true},
      owner:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
      category:{type:mongoose.Schema.Types.ObjectId,ref:"Category"}
})
export const Product=mongoose.model("Product",productSchema);