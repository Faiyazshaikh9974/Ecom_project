import mongoose from "mongoose";
// import {DB_NAME} from '../constatnts.js'

const connection=async()=>{
      try{

            const connectionInstance=await mongoose.connect(`${process.env.MONGO_DB_URL}`);
            console.log(`Monogo Db connected: ${connectionInstance.connection.host}`);
      }
      catch(error){
            console.log("Mongo db connection Failed",error.message);
            process.exit(1);

      }

}

export {connection}