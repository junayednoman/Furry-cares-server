import { Model, ObjectId } from "mongoose";

export type TUser = {
  name: string;
  email: string;
  password: string;
  bio?: string;
  coverPhoto?: string;
  profilePicture?: string;
  role: 'user' | 'admin';
  followers: ObjectId[];
  followerCount?: number;
  following?: ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
  passwordChangedAt?: Date;
  passResetToken?: string
  isVerified?: boolean
}

export type TUserRole = 'user' | 'admin'

export interface TUserModel extends Model<TUser> {
  // eslint-disable-next-line no-unused-vars
  isUserExist(email: string): TUser | null
}