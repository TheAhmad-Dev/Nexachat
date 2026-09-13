import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/constants";
import { ResponseProps } from "@/types";
import axios from "axios";


 export const CLOUDINARY_API_URL =
  `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
 export const ReadyToUploadFile = async ( 
     file :{uri? : string} | string ,
     folderName : string  
 ):Promise<ResponseProps>=>{
     try {
          //if file not existed 
          if(!file)  
               return { success : true    , data : null } 
          // if file is uploaded   earlier (conntains the string type )
               if(typeof file == "string") 
                     return { success : false , data: file }

               if(file && file.uri){
                    //Making Ready  to upload file 
                    const formMyNewdata = new FormData();
                 formMyNewdata.append("file", {
    uri: file.uri,
    name: file.uri.split("/").pop() || "image.jpg",
    type: "image/jpeg",
} as any);
                    formMyNewdata.append("upload_preset" , CLOUDINARY_UPLOAD_PRESET)
                    formMyNewdata.append('folder' , folderName)


                  const response = await axios.post(
  CLOUDINARY_API_URL,
  formMyNewdata,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
);
                    return {success : true , data : response?.data?.secure_url}
               }
               return (
               { success : true , data : null } );
     }
 catch (error: any) {
  console.log("Status:", error.response?.status);
  console.log("Cloudinary Response:", error.response?.data);
  console.log("Request URL:", CLOUDINARY_API_URL);
  console.log("Upload Preset:", CLOUDINARY_UPLOAD_PRESET);
  console.log("Cloud Name:", CLOUDINARY_CLOUD_NAME);

  return {
    success: false,
    msg: error.message,
  };
}
 }
export const getAvatarPathfrom =(file: any  , isGroup = false )=>{

     if(file && typeof file == 'string') return file ;

if(file && typeof file == 'object') return  file.uri ; 

if(isGroup ) return require("../assets/images/DefaultGroupAvatar.png");

return require("../assets/images/Avatar.png");

}