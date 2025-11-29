// import { User } from "../models/user.models.js";
// // import { tokengenrator } from "../utils/token.js";
// import { Contact } from "../models/contact.models.js";
// export const creContact = async (req, res) => {
//   try {
//     const { name,email,phone } = req.body;

import { User } from "../models/user.models.js";
import { asynchandler } from "../utils/asynchandler.js";
import ApiError from "../utils/ApiError.js";
import { uploadCloudnary } from "../utils/cloudnary.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import jwt from 'jsonwebtoken'

//     const contact = await Contact.create({ name,email,phone,refresh_token });
//     // tokengenrator(user);

//     res.status(201).json({
//       success: true,
//       message: "Consultation book  successfully",
//       data:contact,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// export const createUser = async (req, res) => {
//   try {
//     const { username, email,password } = req.body;

//     const user = await User.create({ username, email,password });
//     // tokengenrator(user);

//     res.status(201).json({
//       success: true,
//       message: "User created successfully",
//       data: user,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// export const getUsers = async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.status(200).json({ message:"data fetch sucessfully",success: true, data: users });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

export const createUser = asynchandler(async (req, res) => {
  const { username, email, password } = req.body;

  // ❌ profile_image shouldn't be checked here yet
  if (!username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user exists
  const checkUser = await User.findOne({ $or: [{ email }, { username }] });
  if (checkUser) {
    throw new ApiError(409, "Username or Email already exists");
  }

  // Multer upload check
  const profile_image_path = req.files?.profile_image?.[0]?.path;

  if (!profile_image_path) {
    throw new ApiError(400, "Profile image is required");
  }

  // Upload to Cloudinary
  const profile_image = await uploadCloudnary(profile_image_path);

  if (!profile_image || !profile_image.url) {
    throw new ApiError(400, "Profile image upload failed");
  }

  // Create user
  const user = await User.create({
    username,
    email,
    password,
    profile_image: profile_image.url,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refresh_token"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong");
  }

  return res
    .status(201)
    .json(new Apiresponse(200, createdUser, "User Created successfully"));
});

const genrateAccesstokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accesstoken = await user.genrateAccesstoken();
    const refreshtoken = await user.genrateRefreshtoken();
    
    user.refresh_token = refreshtoken;
    await user.save({ validateBeforeSave: false });

    return { accesstoken, refreshtoken };   // FIXED
  } catch (error) {
    throw new ApiError(500, "Something went wrong during token generation");
  }
};

export const loginUser = asynchandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username && !email) {
    throw new ApiError(400, "email or uername is required");
  }
  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) {
    throw new ApiError(404, "User not found ");
  }
  const passwordValid = await user.isPasswordcorect(password);

  if (!passwordValid) {
    throw new ApiError(401, "Incorrect Password");
  }
  const { accesstoken, refreshtoken } = await genrateAccesstokenAndRefreshToken(
    user._id
  );
  const logedInUser = await User.findById(user._id).select(
    "-password -refresh_token"
  );
  const options = {
    httpOnly: true,
    secure: false,
  };
  return res.status(200).
  cookie("accesstoken", accesstoken, options).
  cookie("refreshtoken",refreshtoken,options)
  .json(new Apiresponse(200,{user:logedInUser,accesstoken,refreshtoken},"User login Successfully"))
});

export const logoutUser = asynchandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refresh_token: null } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: false,
  };

  return res
    .status(200)
    .clearCookie("accesstoken", options)
    .clearCookie("refreshtoken", options)
    .json(new Apiresponse(200, {}, "Logout Successfully"));
});

export const refreshAccessToken=asynchandler(async(req,res)=>{
  try{

  
  const incomingRefreshToken=req.cookies.refreshtoken|| req.body.refreshtoken
  if(incomingRefreshToken){
    throw new ApiError(401,"Unauthorized Reaquest");

  }
  const decodedToken= jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SSECRET);
 const user=await User.findById(decodedToken._id)
 if(!user){
  throw new ApiError(401,"Invalid refresh token");
 }
 if(incomingRefreshToken!==user?.refresh_token){
  throw new ApiError(401,"Refresh Token is expired or Used")
 }
   const options = {
    httpOnly: true,
    secure: false,
  };
 const {accesstoken,newrefreshtoken}= await genrateAccesstokenAndRefreshToken(user._id)
   return res
    .status(200)
    .clearCookie("accesstoken", accesstoken,options)
    .clearCookie("refreshtoken", newrefreshtokenrefreshtoken,options)
    .json(new Apiresponse(200, {accesstoken,refreshtoken:newrefreshtoken},"Acess token is refreshed" ));
  }
  catch(error){
    throw new ApiError(500,"Something went Wrong to genrate");

  }
})

