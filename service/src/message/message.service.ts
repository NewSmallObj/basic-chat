import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageType } from './entities/message.entity';
import { ConversationType } from 'src/conversation/entities/conversation.entity';
import { WsService } from 'src/ws/ws.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel('Messages')
    private readonly messageModel: Model<MessageType>,
    private readonly wsService: WsService,
  ) { }


  async create(createMessageDto: CreateMessageDto, conversation: ConversationType) {
    if (!createMessageDto.body && !createMessageDto.image) {
      throw new HttpException('消息体不能为空', HttpStatus.BAD_REQUEST);
    }

    if (conversation.isGroup) {
      const participants = conversation.participants.filter((item) => item != createMessageDto.senderId)
      const message = await this.messageModel.create({ 
        ...createMessageDto,
        unReads: participants,
      })
      // if(message){
      //   // 循环发送消息
      //   participants.forEach((receiverId)=>{
      //     this.wsService.sendPrivateMessage(message,receiverId);
      //   })
      // }
      return message
    }

    const message = await this.messageModel.create({
      ...createMessageDto,
      unReads: [createMessageDto.receiverId],
    });

    // if (message) {
    //   this.wsService.sendPrivateMessage(message,createMessageDto.receiverId);
    // }
 
    return message
  }

  // 创建系统消息
  async createSystemMessage(payload:{conversation: ConversationType,body:string},@Req() req) {
    
     const message = await this.messageModel.create({
      conversationId:payload.conversation._id,
      body: payload.body,
      system:true,
      senderId: req.user._id,
      receiverId:payload.conversation._id
    })

    // 推送系统消息
    this.wsService.sendGroupSysMessage({
      participants:payload.conversation.participants,
      message,
    },payload.conversation._id);
    
    return message
  }

  // 根据会话id删除相关的所有消息
  async removeByConversationId(conversationId: string) {
    return this.messageModel.deleteMany({
      conversationId,
    });
  }

  async findAll(query: { conversationId: string, page: number }, @Req() req) {
    const { page } = query;
    const limit = 100;
    const skip = (page - 1) * limit;
    const total = await this.messageModel.countDocuments({
      conversationId: query.conversationId,
    })

    const data = await this.messageModel.find({
      conversationId: query.conversationId,
    }).skip(skip).limit(limit).sort({
      createdAt: -1,
    }).populate([
      {
        path: 'senderId',
        populate: {
          path: 'avatar',
        },
        // select: 'username avatar',
      }
    ])
    return { total, list: data };
  }

  async updateReadStatus(conversationId: string, userId: string) {
    await this.messageModel.updateMany({
      conversationId: conversationId,
      unReads: {$in: userId}
    }, {
      $pull: {
        unReads: userId
      }
    })
    return true
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }


  // 删除七天之前的所有消息
  // @Cron(CronExpression.EVERY_10_SECONDS)
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async removeBeforeDaysMessage(){
    const now = new Date();
    // 计算七天前的时间
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    await this.messageModel.deleteMany({
        createdAt:{ $lte: sevenDaysAgo }
      })
    }
}
