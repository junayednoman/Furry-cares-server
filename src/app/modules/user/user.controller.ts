import handleAsyncRequest from "../../utils/handleAsyncRequest"
import { successResponse } from "../../utils/successResponse"
import { userService } from "./user.service"

const getAllUsers = handleAsyncRequest(async (req, res) => {
  const result = await userService.getAllUsers()
  successResponse((res), {
    message: "All users retrieved successfully!", data: result,
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

  const result = await userService.updateProfile(req.body, token!)
  successResponse((res), {
    message: "Profile updated successfully!", data: result,
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

export const userController = {
  getAllUsers,
  getOwnProfile,
  updateProfile,
  followingUser,
  unFollowingUser
}
