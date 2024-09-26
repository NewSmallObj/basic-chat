import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
  {
    // uri: {
    //   type: String,
    //   required: false,
    //   maxlength: [500, '最多500个字符'],
    // },
    type: {
      type: String,
      enum: ['image', 'video'],
      default: 'image',
    },
    fileName: {
      type: String,
      maxlength: [200, '最多200个字符'],
    },
    size: {
      type: Number,
    },
    mimeType: {
      type: String,
      maxlength: [50, '最多50个字符'],
    }
  },
  { timestamps: true },
);

export default fileSchema;

export type FileType = {
  _id: string;
  type?: "image" | "video" | undefined;
  fileName?: string | null | undefined;
  fileSize?: number | undefined;
  mimeType?: string | undefined;
};
