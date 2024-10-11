import { model, Schema, Types } from "mongoose";
import { TPost } from "./post.interface";
import { defaultImage } from "../../constant";

const PostSchema = new Schema({
  author: { type: Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, },
  excerpt: { type: String, },
  thumbnail: { type: String, default: defaultImage },
  category: { type: String, enum: ['tip', 'story'], required: true },
  tags: [{ type: String, }],
  isPremium: { type: Boolean, default: false },
  votes: { type: Number, default: 0 },
  upVotes: [{ type: Types.ObjectId, ref: 'User' }],
  downVotes: [{ type: Types.ObjectId, ref: 'User' }],
  comments: [{ type: Types.ObjectId, ref: 'Comment' }],
  isDeleted: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true },
}, {
  timestamps: true
});


const PostModel = model<TPost>('Post', PostSchema)
export default PostModel