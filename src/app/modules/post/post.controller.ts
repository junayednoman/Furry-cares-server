import { AppError } from "../../error/appError";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import PostModel from "./post.model";
import { postServices } from "./post.service";

const createPost = handleAsyncRequest(async (req, res) => {
  if (!req.file) {
    throw new AppError(400, "Please upload a thumbnail")
  }
  const bodyData = req.body
  const postData = {
    thumbnail: req?.file?.path,
    ...bodyData
  }

  const result = await postServices.createPostIntoDb(postData)
  successResponse((res), {
    message: "Post created successfully!", data: result,
  })
})

const getAllPosts = handleAsyncRequest(async (req, res) => {
  const result = await postServices.getAllPostFromDb()
  successResponse((res), {
    message: `${result.length ? 'Posts retrieved successfully!' : 'There are no posts this collection!'}`, data: result,
  })
})

const getPostById = handleAsyncRequest(async (req, res) => {
  const result = await postServices.getSinglePostFromDb(req.params.id)
  successResponse((res), {
    message: "Post retrieved successfully!", data: result,
  })
})

const updateSinglePost = handleAsyncRequest(async (req, res) => {
  const bodyData = req.body
  let thumbnail
  const oldPost = await PostModel.findById(req.params.id)
  if (req.file) {
    thumbnail = req.file?.path
  } else {
    thumbnail = oldPost?.thumbnail
  }
  const postData = {
    thumbnail,
    ...bodyData
  }

  const retrievedToken = req.headers.authorization
  const token = retrievedToken?.split('Bearer, ')[1]

  const result = await postServices.updateSinglePost(req.params.id, postData, token!)
  successResponse((res), {
    message: "Post updated successfully!", data: result,
  })
})

const updatePostVote = handleAsyncRequest(async (req, res) => {
  const result = await postServices.updatePostVote(req.params.id, req.body.vote)
  successResponse((res), {
    message: "Post vote updated successfully!", data: result,
  })
})

export const postControllers = {
  createPost,
  getAllPosts,
  getPostById,
  updateSinglePost,
  updatePostVote
}