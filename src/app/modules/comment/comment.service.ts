import httpStatus from "http-status";
import { AppError } from "../../error/appError";
import { TComment } from "./comment.interface";
import CommentModel from "./comment.model";
import { UserModel } from "../auth/auth.model";
import PostModel from "../post/post.model";
import config from "../../config";
import { TJwtPayload } from "../../interface/global";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// create comment into database
const createCommentIntoDb = async (comment: TComment, token: string) => {

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // check if user and post exists
    const user = await UserModel.findById(comment.commenter);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "Invalid commenter ID");
    }
    // verify the user
    const decoded = jwt.verify(token!, config.jwt_access_secret as string) as TJwtPayload

    if (comment?.commenter?.toString() !== decoded._id) {
      throw new AppError(httpStatus.FORBIDDEN, 'Forbidden')
    }

    const post = await PostModel.findOne({ _id: comment.post, isDeleted: false });
    if (!post) {
      throw new AppError(httpStatus.NOT_FOUND, "Invalid post ID");
    }
    const newComment = await CommentModel.create([comment], { session });
    // add the comment to the post
    await PostModel.findByIdAndUpdate(post._id, { $push: { comments: newComment[0]?._id } }, { new: true, session },);

    await session.commitTransaction();
    return newComment;
  } catch (err: any) {
    await session.abortTransaction();
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, err.message || "Failed to create comment");
  } finally {
    session.endSession();
  }

  // check if it throws error after jwt expiring in case of not using the try catch method in the jwt verification

}

export const commentServices = {
  createCommentIntoDb
}