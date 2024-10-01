import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { AppError } from '../error/appError';
import { TJwtPayload } from '../interface/global';
import config from '../config';

export const verifyAuthority = (idToVerify: string, token: string) => {
  const decoded = jwt.verify(token, config.jwt_access_secret as string) as TJwtPayload;
  if (idToVerify !== decoded._id) {
    throw new AppError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  return decoded;
};
