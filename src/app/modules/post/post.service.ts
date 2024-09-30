import httpStatus from "http-status";
import { AppError } from "../../error/appError";
import { UserModel } from "../auth/auth.model";
import { TPost } from "./post.interface";
import PostModel from "./post.model";

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

export const postServices = {
  createPostIntoDb,
  getAllPostFromDb,
  getSinglePostFromDb
}