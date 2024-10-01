import httpStatus from 'http-status';
import { AppError } from '../error/appError';
import verifyAccessToken from './verifyJWT';

export const verifyAuthority = (idToVerify: string, token: string) => {
  const decoded = verifyAccessToken(token)
  if (decoded.role !== "admin" && idToVerify !== decoded._id) {
    throw new AppError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  return decoded;
};