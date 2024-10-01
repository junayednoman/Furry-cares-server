import { model, Schema } from "mongoose";

const commentSchema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  commenter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  // createdAt: { type: Date },
  // updatedAt: { type: Date },
},
  { timestamps: true }
)

const CommentModel = model('Comment', commentSchema)
export default CommentModel