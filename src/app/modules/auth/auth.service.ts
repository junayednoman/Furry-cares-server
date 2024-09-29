import config from "../../config"
import { AppError } from "../../error/appError"
import { TUser } from "./auth.interface"
import { UserModel } from "./auth.model"
import httpStatus from "http-status"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

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
    const user = await UserModel.isUserExist(payload.email);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "No user found with the email!")
    }
    if (user.isDeleted) {
        throw new AppError(httpStatus.MOVED_PERMANENTLY, "User is deleted!")
    }

    // check if password match
    const isPasswordMatch = await bcrypt.compare(
        payload?.password,
        user?.password,
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

export const authServices = {
    createUserIntoDb,
    loginUser
}