import { ObjectId } from "mongoose";

export type TPost = {
  author: ObjectId;
  title: string;
  content: string;
  thumbnail: string;
  excerpt?: string;
  category: 'tip' | 'story';
  tags: string[]
  isPremium?: boolean;
  votes: number;
  upVotes: ObjectId[];
  downVotes: ObjectId[];
  comments?: ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
  isPublished: boolean;
}
