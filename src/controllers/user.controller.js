import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.modules.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";\
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = asyncHandler(async (userID) => {
  try {
    const user = await User.findById(userID);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating tokens");
  }
});

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

  const user = await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage.url,
    password,
  });

  const createdUser = await User.findOne(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Error registering the user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  if (!(username || email)) {
    throw new ApiError(400, "username or email required");
  }
  if (!password) {
    throw new ApiError(400, "password is required");
  }
  const user = user.findOne({
    $or: [{ email }, { username }],
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Inavlid Password");
  }

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshToken(user);

  const loggedUser = await User.findOne(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedUser, accessToken, refreshToken },
        "user logged in"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .statis(200)
    .cookie("accessToken", options)
    .cookie("refreshToken", options)
    .json(new ApiResponse(200, {}, " user logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshtoken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(400, " Inavlid refresh Token");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFERESH_TOKEN_SECRET
    );

    const user = User.findById(decodedToken._id);
    if (!user) {
      throw new ApiError(401, " unauthorized user");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(
        401,
        " Unauthorized access as refresh token not matches"
      );
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accesstoken, newrefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newrefreshToken },
          "token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, error?.message || "Error in refresh token");
  }
});
export { registerUser, loginUser, logoutUser,refreshAccessToken };
