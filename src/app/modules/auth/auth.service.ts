import { AppError } from "../../error/appError"
import { TUser } from "./auth.interface"
import { UserModel } from "./auth.model"
import httpStatus from "http-status"

//  Creates a user in the database.
const createUserIntoDb = async (payload: TUser) => {
    if (await UserModel.isUserExist(payload.email)) {
        throw new AppError(httpStatus.CONFLICT, "User already exists!")
    }
    const result = await UserModel.create(payload)
    return result
}

export const authServices = {
    createUserIntoDb
}