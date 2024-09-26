import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { FileType } from 'src/uploads/entities/upload.entity';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      maxlength: [50, '最多50个字符'],
    },
    username: {
      type: String,
      required: true,
      unique: true,
      maxlength: [50, '最多50个字符'],
    },
    image: {
      type: String,
      maxlength: [200, '最多200个字符'],
    },
    password: {
      type: String,
      required: [true, '请输入密码'],
      minlength: [6, '密码最小长度6个字符'],
      maxlength: [50, '最多50个字符'],
      select: false,
    },
    // followingIds:{
    //   type: [
    //     {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: 'User',
    //     }
    //   ],
    //   default: []
    // },
    avatar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Files',
      default: '',
    },
    remark: {
      type: String,
      default: '',
      maxlength: [200, '最多200个字符'],
    },
    conversationIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversations',
        default: [],
      },
    ],
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hashSync(this.password);
});

export default userSchema;

export type UserType = {
  _id: string;
  name: string;
  username: string;
  password: string;
  // followingIds:UserType[]
  avatar: string | FileType;
  image: string;
  status: string;
  remark: string;
  conversationIds: string[];
  createdAt: string;
  updatedAt: string;
};
