import { NextFunction, Request, Response } from "express"
import { TUserRole } from "../modules/auth/auth.interface"
import handleAsyncRequest from "../utils/handleAsyncRequest"
import config from "../config"
import { TJwtPayload } from "../interface/global"
import { UserModel } from "../modules/auth/auth.model"
import httpStatus from "http-status"
import { AppError } from "../error/appError"
import jwt from "jsonwebtoken"
import isJWTIssuedBeforePasswordChanged from "../utils/isJWTIssuedBeforePasswordChanged"

const authGuard = (allowedRules: TUserRole[]) => handleAsyncRequest(
  async (req: Request, res: Response, next: NextFunction) => {
    const retrievedToken = req.headers.authorization
    const token = retrievedToken?.split('Bearer, ')[1]

    // verify token
    const decoded = jwt.verify(token!, config.jwt_access_secret as string) as TJwtPayload

    const user = await UserModel.isUserExist(decoded.email)

    if (!user) {
      throw new AppError(httpStatus.FORBIDDEN, "Forbidden")
    }

    if (
      user.passwordChangedAt &&
      isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        decoded.iat
      )
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
    }



    if (user.isDeleted) {
      throw new AppError(httpStatus.MOVED_PERMANENTLY, "This user is deleted")
    }

    if (user.role !== decoded.role || !allowedRules.includes(user.role)) {
      throw new AppError(httpStatus.FORBIDDEN, "Forbidden")
    }

    const userId = req?.params?.userId
    if (userId && user._id.toString() !== userId) {
      throw new AppError(httpStatus.FORBIDDEN, "Forbidden")
    }

    next()
  }
)

export default authGuard