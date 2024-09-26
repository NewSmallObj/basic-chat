import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { MulterModule } from '@nestjs/platform-express';
import {diskStorage} from 'multer'
import { extname,join } from 'path';
import fileSchema from './entities/upload.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { ConversationModule } from 'src/conversation/conversation.module';


@Module({
  imports: [MulterModule.register({
      storage:diskStorage({
        destination:join(__dirname,"../images"),
        filename:(_,file,callback) => {
            const fileName = `${new Date().getTime() + extname(file.originalname)}`
            return callback(null,fileName)
        }
      })
  }),
  MongooseModule.forFeature([{ name: 'Files', schema: fileSchema }]),
  UserModule,
  ConversationModule
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
