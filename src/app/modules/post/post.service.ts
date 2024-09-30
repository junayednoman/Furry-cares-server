import httpStatus from "http-status";
import { AppError } from "../../error/appError";
import { UserModel } from "../auth/auth.model";
import { TPost } from "./post.interface";
import PostModel from "./post.model";
import config from "../../config";
import { TJwtPayload } from "../../interface/global";
import jwt from "jsonwebtoken";
// create post into database
const createPostIntoDb = async (post: TPost) => {
  const user = await UserModel.findById(post.author)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid author ID')
  }
  const newPost = await PostModel.create(post);
  return newPost;
};

const getAllPostFromDb = async () => {
  const postFromDb = await PostModel.find().populate('author')

  return postFromDb
}

const getSinglePostFromDb = async (id: string) => {
  const postFromDb = await PostModel.findById(id).populate('author')
  if (!postFromDb) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid post ID')
  }
  return postFromDb
}

const updateSinglePost = async (id: string, payload: TPost, token: string) => {
  // verify the user
  const decoded = jwt.verify(token!, config.jwt_access_secret as string) as TJwtPayload

  // check if the update request is from the author
  const postFromDb = await PostModel.findOne({ _id: id, isDeleted: false })

  if (!postFromDb) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid post ID')
  }

  if (postFromDb?.author?.toString() !== decoded._id) {
    throw new AppError(httpStatus.FORBIDDEN, 'Forbidden')
  }

  const updatedPost = await PostModel.findByIdAndUpdate(id, payload, { new: true })
  if (!updatedPost) {
    throw new Error('Unable to update the post!')
  }
  return updatedPost
}

const updatePostVote = async (id: string, vote: string) => {
  // check if the update request is from the author
  const postFromDb = await PostModel.findOne({ _id: id, isDeleted: false })

  if (!postFromDb) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid post ID')
  }

  let totalVotes = postFromDb.votes as number
  if (vote === 'upvote') {
    totalVotes += 1
  } else if (vote === 'downvote') {
    totalVotes -= 1
  }

  const updatedPostVote = await PostModel.findByIdAndUpdate(id, { votes: totalVotes }, { new: true })
  if (!updatedPostVote) {
    throw new Error('Unable to update the post!')
  }
  return updatedPostVote;
}

export const postServices = {
  createPostIntoDb,
  getAllPostFromDb,
  getSinglePostFromDb,
  updateSinglePost,
  updatePostVote
}

