import { AppError } from "../../error/appError";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import { postServices } from "./post.service";

const createPost = handleAsyncRequest(async (req, res) => {
  if (!req.file) {
    throw new AppError(400, "Please upload a thumbnail")
  }
  const bodyData = req.body
  const postData = {
    thumbnail: req.file?.path,
    ...bodyData
  }

  const result = await postServices.createPostIntoDb(postData)
  successResponse((res), {
    message: "Post created successfully!", data: result,
  })
})

export const postControllers = {
  createPost
}