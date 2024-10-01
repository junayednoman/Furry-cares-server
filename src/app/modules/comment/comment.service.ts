import httpStatus from "http-status";
import { AppError } from "../../error/appError";
import { TComment } from "./comment.interface";
import CommentModel from "./comment.model";
import { UserModel } from "../auth/auth.model";
import PostModel from "../post/post.model";
import mongoose from "mongoose";
import { verifyAuthority } from "../../utils/verifyAuthority";

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

    verifyAuthority(comment?.commenter?.toString(), token)

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
}

const updateComment = async (id: string, comment: TComment, token: string) => {

  // check if the update request is from the author
  const commentFromDb = await CommentModel.findOne({ _id: id });

  if (!commentFromDb) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid comment ID')
  }

  verifyAuthority(commentFromDb?.commenter?.toString(), token)

  const updatedComment = await CommentModel.findByIdAndUpdate(id, comment, { new: true })
  if (!updatedComment) {
    throw new Error('Unable to update the comment!')
  }
  return updatedComment
}

const deleteComment = async (id: string, token: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // check if the update request is from the author
    const commentFromDb = await CommentModel.findOne({ _id: id });
    if (!commentFromDb) {
      throw new AppError(httpStatus.NOT_FOUND, 'Invalid comment ID')
    }

    verifyAuthority(commentFromDb?.commenter?.toString(), token)

    const deleteComment = await CommentModel.findOneAndDelete({ _id: id }, { session })

    await PostModel.findByIdAndUpdate(commentFromDb?.post, { $pull: { comments: commentFromDb?._id } }, { new: true, session },);

    session.commitTransaction();
    return deleteComment
  } catch (error: any) {
    session.abortTransaction();
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message || "Failed to delete comment")
  } finally {
    session.endSession();
  }
}


export const commentServices = {
  createCommentIntoDb,
  updateComment,
  deleteComment
}