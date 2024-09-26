import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import {
  CreateConversationDto,
  CreateConversationGroupDto,
} from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { ConversationType } from './entities/conversation.entity';
import { UserService } from '../user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageService } from '../message/message.service';
import { MessageType } from '../message/entities/message.entity';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel('Conversations')
    private readonly conversationModel: Model<ConversationType>,
    private readonly UserService: UserService,
    private readonly MessageService: MessageService,
  ) { }

  async create(createConversationDto: CreateConversationDto, @Req() req) {
    const { senderId, receiverId } = createConversationDto;
    let conversation = await this.conversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
      isGroup: false
    });
    if (!conversation) {
      conversation = await this.conversationModel.create({
        participants: [senderId, receiverId],
      });
    }

    // 给会话成员添加这个会话
    await this.UserService.addConversation(
      conversation.participants,
      conversation._id,
    );
    return conversation;
  }

  async createGroup(createConversationGroup: CreateConversationGroupDto) {
    const { name, participantsIds } = createConversationGroup;
    const users = await this.UserService.findByIds(participantsIds);
    if (users.length < 3)
      throw new HttpException('群成员至少三个', HttpStatus.BAD_REQUEST);
    if (users.length > 200){
      throw new HttpException('群成员最多200人', HttpStatus.BAD_REQUEST);
    }
    const participants = participantsIds.split(',');
    const conversation = await this.conversationModel.create({
      name,
      participants: participants,
      isGroup: true
    });

    // 给每个群成员添加这个会话
    await this.UserService.addConversation(participants, conversation._id);

    return conversation;
  }


  // 会话中添加某个成员
  async addParticipant(payload:{id: string, userId: string},@Req() req){
    const { id, userId } = payload;
    
    const conversation = await this.conversationModel.findById(id);
    if (!conversation){
      throw new HttpException('会话不存在', HttpStatus.BAD_REQUEST);
    }
    if(!conversation.isGroup){
      throw new HttpException('该会话不是群聊', HttpStatus.BAD_REQUEST);
    }
    if(conversation.participants.length >= 200){
      throw new HttpException('群成员最多200人', HttpStatus.BAD_REQUEST);
    }
    if(conversation.participants.includes(userId)){
      throw new HttpException('该用户已存在该群中', HttpStatus.BAD_REQUEST)
    } 
    
    const res = this.conversationModel.findByIdAndUpdate(id, {
      participants: {$push: userId},
     })
     
     this.createGroupMessage({
      conversation,
      body: `${req.user.name} 加入了群聊`
    }, req)
    
    return res
  }
  
  // 移除会话中某个成员
  async removeParticipant(payload:{id: string, userId: string},@Req() req) {
    const { id, userId } = payload;
    const conversation = await this.conversationModel.findById(id);
    if (!conversation){
      throw new HttpException('会话不存在', HttpStatus.BAD_REQUEST);
    }
    if(!conversation.isGroup){
      throw new HttpException('该会话不是群聊', HttpStatus.BAD_REQUEST);
    }
    if(conversation.participants.length < 3){
      throw new HttpException('群成员不可小于3人', HttpStatus.BAD_REQUEST);
    }
    if(!conversation.participants.includes(userId)){
      throw new HttpException('该用户不在该群中', HttpStatus.BAD_REQUEST)
    }
    
    const res = await this.conversationModel.findByIdAndUpdate(id, {
     participants: {$pull: userId},
    })
    
    this.createGroupMessage({
      conversation,
      body: `${req.user.name} 退出了群聊`
    }, req)
    return res
  }

  // 查询与用户有关的所有会话
  async findAll(@Req() req) {
    return this.conversationModel.find({
      participants: { $in: [req.user._id] },
    });
  }

  // 查询与用户有关的所有群会话
  async findGroupAll(@Req() req) {
    return this.conversationModel.find({
      participants: { $in: [req.user._id] },
      isGroup: true
    });
  }
  
  // 查询所有的群聊会话
  async findGroup() {
    return this.conversationModel.find({
      isGroup: true
    });
  }

  // 根据id查询会话相关的所有数据
  async findOne(id: string) {
    return this.conversationModel
      .findOne({
        _id: id,
      }).populate({
        path: 'participants',
      });
  }

  // 添加更新会话接口
  async update(updateConversationDto: UpdateConversationDto) {
    const { id, ...other } = updateConversationDto;
    return this.conversationModel.findByIdAndUpdate(id, {
      ...other,
    });
  }

  // 创建消息
  async createMessage(createMessageDto: CreateMessageDto) {
    const conversation = await this.conversationModel.findById(createMessageDto.conversationId)

    const message = await this.MessageService.create(createMessageDto, conversation);
    await this.addMessage(createMessageDto.conversationId, message);
    return message
  }

  // // 创建群系统消息
  async createGroupMessage(payload:{conversation: ConversationType,body:string},@Req() req) {
    const message = await this.MessageService.createSystemMessage(payload, req);
    
    return message
  }

  // 会话添加消息
  async addMessage(id: string, message: MessageType) {
    const conversation = await this.conversationModel.findByIdAndUpdate(id, {
      $push: { messages: message._id },
      lastMessage: message.body || '[图片]',
      lastMessageAt: message.createdAt,
    });
    return conversation.save();
  }

  // 解散群聊或删除好友
  // 删除会话同时删除相关的所有消息记录
  async remove(id: string) {
    await this.conversationModel.findByIdAndDelete(id);
    await this.MessageService.removeByConversationId(id);
  }
}
