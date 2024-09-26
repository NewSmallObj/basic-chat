import mongoose from 'mongoose';
import { UserType } from '../../user/entities/user.entity';
import { MessageType } from '../../message/entities/message.entity';

const conversationSchema = new mongoose.Schema(
  {
    lastMessageAt: {
      type: Date,
      default: '',
    },
    name: {
      type: String,
      default: '',
      maxlength: [50, '最多50个字符'],
    },
    image: {
      type: String,
      default: '',
      maxlength: [200, '最多200个字符'],
    },
    lastMessage: {
      type: String,
      default: '',
      maxlength: [200, '最多200个字符'],
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Messages',
        default: [],
      },
    ],
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
      },
    ],
  },
  { timestamps: true },
);

export default conversationSchema;

export type ConversationType = {
  _id: string;
  name: string;
  isGroup: boolean;
  lastMessageAt: string;
  lastMessage: string;
  messages: MessageType[];
  image: string;
  participants: string[];
  createdAt: string;
  updatedAt: string;
};
