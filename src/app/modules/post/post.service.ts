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

// update post
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

// update post's vote
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
    throw new Error("Unable to update the post's vote!")
  }
  return updatedPostVote;
}

// delete post
const deletePost = async (id: string, token: string) => {
  // check if the update request is from the author
  const postFromDb = await PostModel.findOne({ _id: id, isDeleted: false })

  if (!postFromDb) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid post ID')
  }

  // verify the user
  const decoded = jwt.verify(token!, config.jwt_access_secret as string) as TJwtPayload

  if (postFromDb?.author?.toString() !== decoded._id) {
    throw new AppError(httpStatus.FORBIDDEN, 'Forbidden')
  }

  const deletePost = await PostModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true })
  if (!deletePost) {
    throw new Error('Unable to delete the post!')
  }
  return deletePost
}

// get user specific post
const getPostByUser = async (userId: string) => {
  const user = await UserModel.findById(userId)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid user ID')
  }
  const postsFromDb = await PostModel.find({ author: userId, isDeleted: false })
  return postsFromDb
}

export const postServices = {
  createPostIntoDb,
  getAllPostFromDb,
  getSinglePostFromDb,
  updateSinglePost,
  updatePostVote,
  deletePost,
  getPostByUser
}

