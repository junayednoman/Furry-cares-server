import { Model, ObjectId } from "mongoose";

export type TUser = {
  _id: string;
  name: string;
  email: string;
  password: string;
  bio?: string;
  profilePicture?: string;
  role: 'user' | 'admin';
  followers: ObjectId[];
  following: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean
}

export interface TUserModel extends Model<TUser> {
  // eslint-disable-next-line no-unused-vars
  isUserExist(email: string): TUser | null
}