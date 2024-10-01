import { ObjectId } from "mongoose";

export type TComment = {
  post: ObjectId;
  text: string;
  commenter: ObjectId;
  _id: ObjectId
}