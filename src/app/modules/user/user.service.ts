import httpStatus from "http-status"
import { AppError } from "../../error/appError"
import verifyAccessToken from "../../utils/verifyJWT"
import { TUser } from "../auth/auth.interface"
import { UserModel } from "../auth/auth.model"
import mongoose, { ObjectId } from "mongoose"
import QueryBuilder from "../../builder/QueryBuilder"
import { TJwtPayload } from "../../interface/global"

const getAllUsers = async (query: Record<string, unknown>) => {
  const searchableFields = ['name', 'email', 'bio', 'role']
  const userQuery = new QueryBuilder(UserModel.find().populate(['following', 'followers']), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .selectFields()

  const meta = await userQuery.countTotal();
  const result = await userQuery.queryModel
  return { result, meta }
}


const getSingleUser = async (id: string) => {
  const result = await UserModel.findById(id).populate('following followers')

  if (result?.isDeleted) {
    throw new AppError(httpStatus.MOVED_PERMANENTLY, 'User is deleted')
  }

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found')
  }
  return result;
}

// get own profile
const getOwnProfile = async (token: string) => {
  // verify token
  const decoded = verifyAccessToken(token)
  const user = UserModel.isUserExist(decoded.email) as TUser

  return user
}

// update profile
const updateProfile = async (payload: Partial<TUser>, decoded: TJwtPayload) => {
  // verify token

  await UserModel.isUserExist(decoded.email) as TUser
  const result = await UserModel.findByIdAndUpdate(decoded._id, {
    ...payload
  }, { new: true })
  return result
}

// handle change user role
const changeUserRole = async (id: string) => {
  const user = await UserModel.findById(id)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid user id')
  }
  const result = await UserModel.findByIdAndUpdate(id, {
    role: user.role === 'admin' ? 'user' : 'admin'
  })
  return result;
}

// handle following user
const followingUser = async (token: string, followingId: string) => {
  const decoded = verifyAccessToken(token)
  await UserModel.isUserExist(decoded.email) as TUser
  const followingUser = await UserModel.findById(followingId)
  if (!followingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid following user ID')
  }

  if (decoded._id === String(followingId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You cannot follow yourself')
  }

  if (followingUser.followers.includes(decoded._id as unknown as ObjectId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You are already following this user')
  }

  const session = await mongoose.startSession()
  try {
    session.startTransaction()

    await UserModel.findByIdAndUpdate(followingId,
      {
        $set: { followerCount: followingUser?.followers?.length + 1 },
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
  const unFollowingUser = await UserModel.findById(unFollowingId)
  if (!unFollowingUser) {
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
        followerCount: unFollowingUser?.followers?.length - 1,
        $pull: { followers: decoded._id }
      },
      { session }
    )

    const removeFollowing = await UserModel.findByIdAndUpdate(decoded._id,
      {
        $pull: { following: unFollowingId }
      },
      { session }
    )

    await session.commitTransaction()
    return removeFollowing
  } catch (error: any) {
    await session.abortTransaction()
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Failed to follow user')
  } finally {
    session.endSession()
  }
}


// delete user
const deleteUser = async (id: string) => {
  const user = await UserModel.findById(id)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid user id')
  }

  const result = await UserModel.findByIdAndUpdate(id, {
    isDeleted: !user?.isDeleted
  })
  return result;
}

export const userService = {
  getAllUsers,
  getOwnProfile,
  updateProfile,
  followingUser,
  unFollowingUser,
  getSingleUser,
  changeUserRole,
  deleteUser
}