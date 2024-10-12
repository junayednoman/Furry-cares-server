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

const updateComment = handleAsyncRequest(
  async (req, res) => {
    const authToken = req.headers.authorization;
    const token = authToken?.split('Bearer, ')[1]
    const comment = req.body
    const commentId = req.params.id
    const result = await commentServices.updateComment(commentId, comment, token!)
    successResponse((res), {
      message: "Comment updated successfully!", data: result,
    })
  }
)

const deleteComment = handleAsyncRequest(
  async (req, res) => {
    const authToken = req.headers.authorization
    const token = authToken?.split('Bearer, ')[1]
    const commentId = req.params.id
    const result = await commentServices.deleteComment(commentId, token!)
    successResponse((res), {
      message: "Comment deleted successfully!", data: result,
    })
  }
)

const getAllComments = handleAsyncRequest(
  async (req, res) => {
    const result = await commentServices.getAllComments(req.query)
    successResponse((res), {
      message: "Comments retrieved successfully!", data: result,
    })
  }
)



export const commentControllers = {
  createComment,
  updateComment,
  deleteComment,
  getAllComments
}