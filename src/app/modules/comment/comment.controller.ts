import handleAsyncRequest from "../../utils/handleAsyncRequest"
import { successResponse } from "../../utils/successResponse"
import { commentServices } from "./comment.service"

const createComment = handleAsyncRequest(
  async (req, res) => {
    const authToken = req.headers.authorization
    const token = authToken?.split('Bearer, ')[1]
    const postData = req.body
    const result = await commentServices.createCommentIntoDb(postData, token!)
    successResponse((res), {
      message: "Comment created successfully!", data: result,
    })
  }
)

export const commentControllers = {
  createComment
}