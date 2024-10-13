import httpStatus from "http-status";
import { AppError } from "../../error/appError";
import { UserModel } from "../auth/auth.model";
import { TPost } from "./post.interface";
import PostModel from "./post.model";
import verifyAccessToken from "../../utils/verifyJWT";
import { verifyAuthority } from "../../utils/verifyAuthority";
import QueryBuilder from "../../builder/QueryBuilder";
import { ObjectId } from "mongoose";

const searchableFields = ['title', 'content', 'tags', 'excerpt']

// create post into database
const createPostIntoDb = async (post: TPost) => {
  const user = await UserModel.findById(post.author)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid author ID')
  }
  const newPost = await PostModel.create(post);
  return newPost;
};

const getAllPostFromDb = async (query: Record<string, unknown>) => {
  const postQuery = new QueryBuilder(PostModel.find({ isDeleted: false }).populate(['author', 'comments']), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .selectFields()
    .filterByPostedTime();

  const meta = await postQuery.countTotal();
  const result = await postQuery.queryModel
  return { result, meta }
}

const getSinglePostFromDb = async (id: string) => {
  const postFromDb = await PostModel.findById(id).populate('author')
  if (!postFromDb) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid post ID')
  }
  if (postFromDb.isDeleted) {
    throw new AppError(httpStatus.MOVED_PERMANENTLY, 'Post is deleted')
  }
  return postFromDb
}

// update post
const updateSinglePost = async (id: string, payload: TPost, token: string) => {
  // verify the user
  const decoded = verifyAccessToken(token)

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
const updatePostVote = async (postId: string, userId: string, voteType: 'up' | 'down') => {
  // check if the update request is from the author
  const user = await UserModel.findById(userId)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid user ID')
  }
  if (user.isDeleted) {
    throw new AppError(httpStatus.MOVED_PERMANENTLY, 'User is deleted')
  }

  const post = await PostModel.findOne({ _id: postId, isDeleted: false })

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid post ID')
  }

  let updateDoc = {}
  if (voteType === 'up') {
    let votes = post.votes + 1;
    updateDoc = { $push: { upVotes: user._id }, votes }
    if (post.upVotes.includes(user._id as unknown as ObjectId)) {
      votes = post.votes - 1
      updateDoc = { $pull: { upVotes: user._id }, votes }
    }
    if (post.downVotes.includes(user._id as unknown as ObjectId)) {
      votes = post.votes + 2;
      updateDoc = { $push: { upVotes: user._id }, $pull: { downVotes: user._id }, votes }
    }
  } else if (voteType === 'down') {
    let votes = post.votes - 1;
    updateDoc = { $push: { downVotes: user._id }, votes };
    if (post.downVotes.includes(user._id as unknown as ObjectId)) {
      votes = post.votes + 1
      updateDoc = { $pull: { downVotes: user._id }, votes };
    }
    if (post.upVotes.includes(user._id as unknown as ObjectId)) {
      votes = post.votes - 2;
      updateDoc = { $push: { downVotes: user._id }, $pull: { upVotes: user._id }, votes };
    }
  }

  const result = await PostModel.findOneAndUpdate(
    { _id: postId, isDeleted: false },
    updateDoc,
    { new: true }
  )

  return result

}
// delete post
const deletePost = async (id: string, token: string) => {
  // check if the update request is from the author
  const postFromDb = await PostModel.findOne({ _id: id, isDeleted: false })

  if (!postFromDb) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid post ID')
  }

  // verify the user
  verifyAuthority(postFromDb?.author?.toString(), token)

  const deletePost = await PostModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true })
  if (!deletePost) {
    throw new Error('Unable to delete the post!')
  }
  return deletePost
}

// get user specific post
const getPostByUser = async (userId: string, query: Record<string, unknown>) => {
  const user = await UserModel.findById(userId)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid user ID')
  }

  const postQuery = new QueryBuilder(PostModel.find({ author: userId, isDeleted: false }), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .selectFields()
    .filterByPostedTime();

  const meta = await postQuery.countTotal();
  const result = await postQuery.queryModel
  return { result, meta }
}


// update post publish status
const updatePostPublishStatus = async (id: string, isPublished: boolean, token: string) => {
  const postFromDb = await PostModel.findOne({ _id: id, isDeleted: false })
  if (!postFromDb) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid post ID')
  }

  verifyAuthority(postFromDb.author.toString(), token)
  const updatedPost = await PostModel.findByIdAndUpdate(id, { isPublished }, { new: true })
  if (!updatedPost) {
    throw new Error('Unable to update the post publish status!')
  }
  return updatedPost
}


export const postServices = {
  createPostIntoDb,
  getAllPostFromDb,
  getSinglePostFromDb,
  updateSinglePost,
  updatePostVote,
  deletePost,
  getPostByUser,
  updatePostPublishStatus
}

