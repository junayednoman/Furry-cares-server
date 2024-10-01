import httpStatus from "http-status"
import { AppError } from "../../error/appError"
import verifyAccessToken from "../../utils/verifyJWT"
import { TUser } from "../auth/auth.interface"
import { UserModel } from "../auth/auth.model"
import mongoose from "mongoose"

const getAllUsers = async () => {
  const users = await UserModel.find().populate(['following', 'followers'])
  return users
}

// get own profile
const getOwnProfile = async (token: string) => {
  // verify token
  const decoded = verifyAccessToken(token)
  const user = UserModel.isUserExist(decoded.email) as TUser

  return user
}

// update profile
const updateProfile = async (payload: Partial<TUser>, token: string) => {
  // verify token
  const decoded = verifyAccessToken(token)
  await UserModel.isUserExist(decoded.email) as TUser
  const result = await UserModel.findByIdAndUpdate(decoded._id, {
    ...payload
  }, { new: true })
  return result
}

// handle following user
const followingUser = async (token: string, followingId: string) => {
  const decoded = verifyAccessToken(token)
  await UserModel.isUserExist(decoded.email) as TUser
  const followingUser = await UserModel.findById(followingId)
  if (!followingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid following user ID')
  }

  if (decoded._id === followingId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You cannot follow yourself')
  }

  const session = await mongoose.startSession()
  try {
    session.startTransaction()

    await UserModel.findByIdAndUpdate(followingId,
      {
        $push: { followers: decoded._id }
      },
      { session }
    )

    const addFollowing = await UserModel.findByIdAndUpdate(decoded._id,
      {
        $push: { following: followingId }
      },
      { session }
    )

    await session.commitTransaction()
    return addFollowing
  } catch (error: any) {
    await session.abortTransaction()
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Failed to follow user')
  } finally {
    session.endSession()
  }
}

// handle unfollowing user
const unFollowingUser = async (token: string, unFollowingId: string) => {
  const decoded = verifyAccessToken(token)
  await UserModel.isUserExist(decoded.email) as TUser
  const followingUser = await UserModel.findById(unFollowingId)
  if (!followingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid unfollowing user ID')
  }

  if (decoded._id === unFollowingId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You cannot follow or unfollow yourself')
  }

  const session = await mongoose.startSession()
  try {
    session.startTransaction()

    await UserModel.findByIdAndUpdate(unFollowingId,
      {
        $pull: { followers: decoded._id }
      },
      { session }
    )

    const addFollowing = await UserModel.findByIdAndUpdate(decoded._id,
      {
        $pull: { following: unFollowingId }
      },
      { session }
    )

    await session.commitTransaction()
    return addFollowing
  } catch (error: any) {
    await session.abortTransaction()
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Failed to follow user')
  } finally {
    session.endSession()
  }
}

export const userService = {
  getAllUsers,
  getOwnProfile,
  updateProfile,
  followingUser,
  unFollowingUser
}