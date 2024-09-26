import mongoose from 'mongoose';
import { UserType } from '../../user/entities/user.entity';

const messageSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: false,
      maxlength: [50, '最多200个字符'],
    },
    image: {
      type: String,
      required: false,
      maxlength: [50, '最多200个字符'],
    },
    senderId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
      },
    ],
    system: {
      type: Boolean,
      default: false,
    },
    receiverId: {
      type: String,
      required: true,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversations',
      required: true,
    },
    unReads: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
      },
    ],
    // createdAt,updatedAt
  },
  { timestamps: true },
);

export default messageSchema;

export type MessageType = {
  _id: string;
  body: string;
  image: string;
  senderId: UserType[];
  receiverId: string;
  conversationId: string;
  unReads: string[];
  createdAt: string;
  updatedAt: string;
  system?: boolean;
};
