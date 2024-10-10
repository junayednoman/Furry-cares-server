import handleAsyncRequest from "../../utils/handleAsyncRequest"
import { successResponse } from "../../utils/successResponse"
import { userService } from "./user.service"
import { TBodyReqFiles } from "../../types"
import verifyAccessToken from "../../utils/verifyJWT"
import { UserModel } from "../auth/auth.model"

const getAllUsers = handleAsyncRequest(async (req, res) => {
  const result = await userService.getAllUsers(req.query)
  successResponse((res), {
    message: "All users retrieved successfully!", data: result,
  })
})

const getSingleUser = handleAsyncRequest(async (req, res) => {
  const result = await userService.getSingleUser(req.params.userId)
  successResponse((res), {
    message: "User retrieved successfully!", data: result,
  })
})

const getOwnProfile = handleAsyncRequest(async (req, res) => {
  const authToken = req.headers.authorization
  const token = authToken?.split('Bearer, ')[1]

  const result = await userService.getOwnProfile(token!)
  successResponse((res), {
    message: "Profile retrieved successfully!", data: result,
  })
})

const updateProfile = handleAsyncRequest(async (req, res) => {
  const authToken = req.headers.authorization
  const token = authToken?.split('Bearer, ')[1]
  const decoded = verifyAccessToken(token!)

  const oldProfile = await UserModel.findById(decoded._id)
  let profilePicture = oldProfile?.profilePicture
  let coverPhoto = oldProfile?.coverPhoto

  const files = req?.files as TBodyReqFiles
  if (files?.profilePicture) {
    profilePicture = files?.profilePicture[0]?.path;
  }
  if (files?.coverPhoto) {
    coverPhoto = files?.coverPhoto[0]?.path
  }

  const bodyData = req.body
  const postData = {
    profilePicture,
    coverPhoto,
    ...bodyData
  }

  const result = await userService.updateProfile(postData, decoded)
  successResponse((res), {
    message: "Profile updated successfully!", data: result,
  })
})

const changeUserRole = handleAsyncRequest(async (req, res) => {
  const result = await userService.changeUserRole(req.body.userId)
  successResponse((res), {
    message: "User role updated successfully!", data: result,
  })
})

const followingUser = handleAsyncRequest(async (req, res) => {
  const authToken = req.headers.authorization
  const token = authToken?.split('Bearer, ')[1]
  const result = await userService.followingUser(token!, req.body.followingId)
  successResponse((res), {
    message: "Follow created successfully!", data: result,
  })
})

const unFollowingUser = handleAsyncRequest(async (req, res) => {
  const authToken = req.headers.authorization
  const token = authToken?.split('Bearer, ')[1]
  const result = await userService.unFollowingUser(token!, req.body.unFollowingId)
  successResponse((res), {
    message: "Unfollowed successfully!", data: result,
  })
})

const deleteUser = handleAsyncRequest(async (req, res) => {
  const result = await userService.deleteUser(req.params.userDeleteId)
  successResponse((res), {
    message: "User status updated successfully!", data: result,
  })
})

export const userController = {
  getAllUsers,
  getOwnProfile,
  updateProfile,
  followingUser,
  unFollowingUser,
  getSingleUser,
  changeUserRole,
  deleteUser
}
