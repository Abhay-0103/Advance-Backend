import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validate user details
    // check if user already exists
    // check for image, check foe avatar
    // upload image to cloudinary, avatar
    // create user object - create enrty in db
    // // remove password and refereh token from response
    // check for user creation
    // return res


    const { fullName, email, username, password } = req.body
    // console.log("email:", email);

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User already exists with this email or username");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar and cover image is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath, "avatars")
    const coverImage = await uploadOnCloudinary(coverImageLocalPath, "coverImages")

    if (!avatar) {
        throw new ApiError(400, "Failed to upload images");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Failed to create user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User created successfully")
    )

})


export { registerUser };