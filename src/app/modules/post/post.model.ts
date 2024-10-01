import { model, Schema, Types } from "mongoose";
import { TPost } from "./post.interface";

const PostSchema = new Schema({
  author: { type: Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  thumbnail: { type: String, required: true },
  category: { type: String, enum: ['tip', 'story'], required: true },
  tags: [{ type: String, required: true }],
  isPremium: { type: Boolean, default: false },
  votes: { type: Number, default: 0 },
  comments: [{ type: Types.ObjectId, ref: 'Comment' }],
  isDeleted: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true },
}, {
  timestamps: true
});


const PostModel = model<TPost>('Post', PostSchema)
export default PostModel