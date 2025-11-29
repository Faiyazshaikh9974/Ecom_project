import dotenv from 'dotenv';
dotenv.config();
import {app} from './app.js';
const PORT=process.env.PORT || 8000
import { connection } from './db/index.js';
connection().then(()=>{
  app.listen(PORT,()=>console.log(`Sever is running on:${PORT}`));
})