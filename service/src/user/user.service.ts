import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserType } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('Users') private readonly userModel: Model<UserType>,
  ) { }
  async create(createUserDto: CreateUserDto) {
    const { username } = createUserDto;
    const existUser = await this.userModel.findOne({
      username,
    });
    if (existUser) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }
    const newUser = await this.userModel.create(createUserDto);
    return newUser._id;
  }

  async findAll(@Req() req) {
    return this.userModel.where({
      _id: { $ne: req.user._id }
    }).populate('avatar');
  }

  async findAllUser() {
    return this.userModel.find().populate('avatar');
  }

  async findConversation(@Req() req) {
    const res = await this.userModel.findById(req.user._id).populate({
      path: 'conversationIds',
      populate: [
        {
          path: 'participants',
          populate: {
            path: 'avatar',
          },
          // select: 'username avatar',
        },
        {
          path: 'messages',
          options: { sort: { createdAt: -1 }, limit: 100 },
          match: { unReads: { $in: req?.user?._id } }
        }
      ],
    });
    return res.conversationIds
  }

  async findByUsername(username: string) {
    return this.userModel.findOne({
      username,
    }).populate('avatar');
  }

  async findByIds(participantIds: string) {
    const ids = participantIds.split(',');
    return this.userModel.where({
      _id: { $in: ids }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findUserinfo(@Req() req) {
    return this.userModel.findById(req.user._id).populate('avatar');
  }

  async update(updateUserDto: UpdateUserDto) {
    const { id, ...update } = updateUserDto;
    await this.userModel.findByIdAndUpdate(id,
      update
    )

    return this.userModel.findById(id).populate('avatar');
  }

  async addConversation(participants: string[], conversationId: string) {
    const userCoversations = await this.userModel.find({
      _id: { $in: participants },
      conversationIds: { $nin: conversationId },
    });
    if (userCoversations.length) {
      await this.userModel.updateMany(
        {
          _id: { $in: participants },
          conversationIds: { $nin: conversationId },
        },
        {
          $push: { conversationIds: conversationId },
        },
      );
    }
    return true;
  }

  // 根据会话id移除用户的某个会话
  async removeConversationById(conversationId: string, @Req() req) {
    return this.userModel.updateOne(
      {
        _id: req.user._id,
      },
      {
        $pull: { conversationIds: conversationId },
      },
    );
  }

  async remove(id: string) {
    return this.userModel.deleteOne({
      _id: id,
    });
  }
}
