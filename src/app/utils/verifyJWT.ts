import jwt from 'jsonwebtoken'
import config from '../config'
import { TJwtPayload } from '../interface/global'
const verifyAccessToken = (token: string) => {
  const decoded = jwt.verify(token, config.jwt_access_secret as string) as TJwtPayload
  return decoded
}
export default verifyAccessToken;