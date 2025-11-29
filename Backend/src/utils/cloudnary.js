import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "dxmh24cat",
  api_key: "121824247631446",
  api_secret: "7bfNocl_0dTLBt4J6uOI-wqcucc", // Click 'View API Keys' above to copy your API secret
});

const uploadCloudnary=async (locafilepath)=>{
      try{
            if(!locafilepath) return null
            //upload the file on cloudnary
          const response=  await cloudinary.uploader.upload(locafilepath,{
                  resource_type:"auto"
            })

            //file uploaded
            console.log("file is uploaded on cloudnary",response.url);
            return response;

      }
      catch(error){
            fs.unlinkSync(locafilepath) //remove the locally saved file
            return null;

      }
}



export  {uploadCloudnary}
