import config from "../../config"
import { AppError } from "../../error/appError"
import { TUser } from "./auth.interface"
import { UserModel } from "./auth.model"
import httpStatus from "http-status"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { sendEmail } from "../../utils/sendEmail"
import verifyAccessToken from "../../utils/verifyJWT"

//  Creates a user in the database.
const createUserIntoDb = async (payload: TUser) => {
    const existedUser = await UserModel.findOne({ email: payload.email })
    if (existedUser) {
        throw new AppError(httpStatus.BAD_REQUEST, "User already exists")
    }

    const newUser = await UserModel.create(payload)
    const jwtPayload = {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
    }
    const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret!, { expiresIn: config.jwt_access_expires_in });
    const refreshToken = jwt.sign(jwtPayload, config.jwt_refresh_secret!, { expiresIn: config.jwt_refresh_expires_in });
    return {
        accessToken,
        refreshToken
    }
}

const loginUser = async (payload: Pick<TUser, "email" | "password" | "isDeleted">) => {
    const user = await UserModel.isUserExist(payload.email) as TUser & { _id: string };

    // check if password match
    const isPasswordMatch = await bcrypt.compare(
        payload?.password,
        user.password,
    );
    if (!isPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Password is incorrect!")
    }

    const jwtPayload = {
        _id: user._id,
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
    const user = await UserModel.isUserExist(payload.email) as TUser & { _id: string };

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
const resetPassword = async (payload: { newPassword: string }, token: string) => {

    // verify token
    const decoded = verifyAccessToken(token)
    const user = await UserModel.isUserExist(decoded.email) as TUser
    if (user.role !== decoded.role) {
        throw new AppError(httpStatus.FORBIDDEN, "Forbidden")
    }

    if (user?.passResetToken && token !== user.passResetToken) {
        throw new AppError(httpStatus.FORBIDDEN, "Forbidden")
    }

    const newHashedPass = await bcrypt.hash(payload.newPassword, Number(config.salt_rounds!))

    const result = await UserModel.findOneAndUpdate({ email: user.email }, { password: newHashedPass, passwordChangedAt: new Date(), $unset: { passResetToken: 1 }, })

    return {
        result
    }
}



// get new accessTOken
const getNewAccessToken = async (token: string) => {

    // verify token
    const decoded = verifyAccessToken(token)
    const user = await UserModel.isUserExist(decoded.email) as TUser & { _id: string }

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


export const authServices = {
    createUserIntoDb,
    loginUser,
    forgetPassword,
    resetPassword,
    getNewAccessToken,
}