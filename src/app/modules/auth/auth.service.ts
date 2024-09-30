import config from "../../config"
import { AppError } from "../../error/appError"
import { TUser } from "./auth.interface"
import { UserModel } from "./auth.model"
import httpStatus from "http-status"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { sendEmail } from "../../utils/sendEmail"
import { TJwtPayload } from "../../interface/global"

//  Creates a user in the database.
const createUserIntoDb = async (payload: TUser) => {
    if (await UserModel.isUserExist(payload.email)) {
        throw new AppError(httpStatus.CONFLICT, "User already exists!")
    }

    const newUser = await UserModel.create(payload)
    const jwtPayload = {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
    }
    const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret!, { expiresIn: config.jwt_access_expires_in });
    const refreshToken = jwt.sign(jwtPayload, config.jwt_refresh_secret!, { expiresIn: config.jwt_refresh_expires_in });
    return {
        accessToken,
        refreshToken
    }
}

const loginUser = async (payload: Pick<TUser, "email" | "password" | "isDeleted">) => {
    const user = await UserModel.isUserExist(payload.email) as TUser;

    // check if password match
    const isPasswordMatch = await bcrypt.compare(
        payload?.password,
        user.password,
    );
    if (!isPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Password is incorrect!")
    }

    const jwtPayload = {
        _id: user._id as string,
        name: user.name,
        email: user.email,
        role: user.role
    }
    const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret!, { expiresIn: config.jwt_access_expires_in });
    const refreshToken = jwt.sign(jwtPayload, config.jwt_refresh_secret!, { expiresIn: config.jwt_refresh_expires_in });

    return {
        accessToken,
        refreshToken
    }
}

// forget password
const forgetPassword = async (payload: Pick<TUser, "email">) => {
    const user = await UserModel.isUserExist(payload.email) as TUser;

    // generate token
    const jwtPayload = {
        _id: user._id as string,
        email: user.email,
        role: user.role
    }

    const resetToken = jwt.sign(jwtPayload, config.jwt_access_secret!, { expiresIn: '10m' });

    const resetUrl = `${config.reset_password_ui_link}${payload.email}&token=${resetToken}`

    await UserModel.findByIdAndUpdate(user._id, {
        $set: {
            passResetToken: resetToken
        }
    })

    // send email with reset url
    sendEmail(user.email, 'Reset Your Password - Furry Tales', `We received a request to reset your password for your Furry Tales account. Please click the link below to choose a new password: ${resetUrl}`)
    return {
        resetUrl
    }
}

// reset password
const resetPassword = async (payload: { email: string, newPassword: string }, token: string) => {

    // verify token
    const decoded = jwt.verify(token!, config.jwt_access_secret as string) as TJwtPayload
    const user = await UserModel.isUserExist(decoded.email) as TUser

    if (user.role !== decoded.role) {
        throw new AppError(httpStatus.FORBIDDEN, "Forbidden")
    }

    if (token !== user.passResetToken) {
        throw new AppError(httpStatus.FORBIDDEN, "Forbiddens")
    }

    const newHashedPass = await bcrypt.hash(payload.newPassword, Number(config.salt_rounds!))

    const result = await UserModel.findOneAndUpdate({ email: payload.email }, { password: newHashedPass, passResetToken: '' })

    return {
        result
    }
}

// get own profile
const getOwnProfile = async (token: string) => {
    // verify token
    const decoded = jwt.verify(token, config.jwt_access_secret as string) as TJwtPayload
    const user = UserModel.isUserExist(decoded.email) as TUser

    return user
}

// update profile
const updateProfile = async (payload: Partial<TUser>) => {
    const result = await UserModel.findByIdAndUpdate(payload._id, {
        $set: { ...payload }
    }, { new: true })

    return result
}


// get new accessTOken
const getNewAccessToken = async (token: string) => {

    // verify token
    const decoded = jwt.verify(token, config.jwt_access_secret as string) as TJwtPayload
    const user = await UserModel.isUserExist(decoded.email)

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found!")
    }

    if (user.isDeleted) {
        throw new AppError(httpStatus.MOVED_PERMANENTLY, "User is deleted")
    }

    const jwtPayload = {
        _id: user._id as string,
        name: user.name,
        email: user.email,
        role: user.role
    }
    const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret!, { expiresIn: config.jwt_access_expires_in });


    return { accessToken }
}


// get all  users
const getAllUsers = async () => {
    const users = await UserModel.find()
    return users
}

export const authServices = {
    createUserIntoDb,
    loginUser,
    forgetPassword,
    resetPassword,
    getOwnProfile,
    updateProfile,
    getNewAccessToken,
    getAllUsers
}