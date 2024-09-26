import { Module, Global } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import conversationSchema from './entities/conversation.entity';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageModule } from '../message/message.module';


@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Conversations', schema: conversationSchema },
    ]),
    UserModule,
    MessageModule,
  ],
  controllers: [ConversationController],
  providers: [ConversationService],
  exports: [ConversationService],
})
export class ConversationModule { }
