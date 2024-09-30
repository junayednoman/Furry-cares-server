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
        message: "Reset password token generated!", data: result,
    })
})

const resetPassword = handleAsyncRequest(async (req, res) => {
    const token = req.headers.authorization
    const result = await authServices.resetPassword(req.body, token!)
    successResponse((res), {
        message: "Password reset successfully!", data: result,
    })
})

export const authControllers = {
    createUser,
    loginUser,
    forgetPassword,
    resetPassword
}