import { authServices } from "./auth.service"
import { successResponse } from "../../utils/successResponse"
import handleAsyncRequest from "../../utils/handleAsyncRequest"
import config from "../../config"
import httpStatus from "http-status"

const createUser = handleAsyncRequest(async (req, res) => {
    const result = await authServices.createUserIntoDb(req.body)
    res.cookie('refreshToken', result.refreshToken, {
        secure: config.node_env === 'production',
        httpOnly: true
    })
    successResponse((res), {
        message: "User registered successfully!", data: result,
        status: httpStatus.CREATED
    })
})

const loginUser = handleAsyncRequest(async (req, res) => {
    const result = await authServices.loginUser(req.body)
    res.cookie('refreshToken', result.refreshToken, {
        secure: config.node_env === 'production',
        httpOnly: true
    })
    successResponse((res), {
        message: "User logged in successfully!", data: result,
    })
})

const forgetPassword = handleAsyncRequest(async (req, res) => {
    const result = await authServices.forgetPassword(req.body)
    successResponse((res), {
        message: "Reset password token generated!",
        data: result,
    })
})

const resetPassword = handleAsyncRequest(async (req, res) => {
    const authToken = req.headers.authorization
    const token = authToken?.split('Bearer, ')[1]
    const result = await authServices.resetPassword(req.body, token!)

    successResponse((res), {
        message: "Password reset successfully!", data: result,
    })
})

const getOwnProfile = handleAsyncRequest(async (req, res) => {
    const authToken = req.headers.authorization
    const token = authToken?.split('Bearer, ')[1]

    const result = await authServices.getOwnProfile(token!)
    successResponse((res), {
        message: "Profile retrieved successfully!", data: result,
    })
})

const updateProfile = handleAsyncRequest(async (req, res) => {
    const result = await authServices.updateProfile(req.body)
    successResponse((res), {
        message: "Profile updated successfully!", data: result,
    })
})

const getNewAccessToken = handleAsyncRequest(async (req, res) => {
    const authToken = req.headers.authorization
    const token = authToken?.split('Bearer, ')[1]

    const result = await authServices.getNewAccessToken(token!)
    successResponse((res), {
        message: "Access token retrieved successfully!", data: result,
    })
})

const getAllUsers = handleAsyncRequest(async (req, res) => {
    const result = await authServices.getAllUsers()
    successResponse((res), {
        message: "All users retrieved successfully!", data: result,
    })
})

export const authControllers = {
    createUser,
    loginUser,
    forgetPassword,
    resetPassword,
    getOwnProfile,
    updateProfile,
    getNewAccessToken,
    getAllUsers
}