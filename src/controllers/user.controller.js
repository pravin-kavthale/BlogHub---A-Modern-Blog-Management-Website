import { asyncHandler } from "./utils/asyncHandler.js";
import { ApiError } from "./utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { ApiResponse } from "../utils/ApiResponse";

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frotend
  // validation- not empty
  // check i user already exists: username and  email
  // check for images check for  avatar
  // upload them to cloudnairy
  //  create user object -create entry in db
  // remove password and refresh token field
  // check for user creation
  // returen res
  const { fullName, username, email, password } = req.body;

  if (
    [fullName, username, email, password].some((fields) => fields?.trim() == "")
  ) {
    throw new ApiError(400, "Full information required");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (existingUser) {
    throw new ApiError(402, "UserName of Email is already registered");
  }

  const avatarLoaclPath = req.files?.avatar?.[0]?.path || null;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path || null;
  if (!avatarLoaclPath) {
    throw new ApiError(403, "Avatar is reqired");
  }

  const avatar = await uploadOnCloudinary(avatarLoaclPath);
  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

  const user = await User.create(
    fullName,
    email,
    (username = username.toLowerCase()),
    (avatar = avatar.url),
    (coverImage = coverImage.url)
  );

  const createdUser = await User.findOne(user._id).select("-password -refreshToken");

  if(!createdUser)
  {
    throw new ApiError(500, "Error registering the user")
  }
  return res.status(201).json(ApiResponse(200,createdUser,"user registered successfully"))
});

export { registerUser };
