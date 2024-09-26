import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import messageSchema from './entities/message.entity';
import { WsModule } from 'src/ws/ws.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Messages', schema: messageSchema }]),
    WsModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService]
})
export class MessageModule { }
