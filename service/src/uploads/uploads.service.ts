import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { ConversationService } from 'src/conversation/conversation.service';
import { FileType } from './entities/upload.entity';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class UploadsService {

  constructor(
    @InjectModel('Files') 
    private readonly fileModel: Model<FileType>,
    private readonly UserService: UserService,
    private readonly ConversationService: ConversationService
  ) { }
  async create(file) {
    return this.fileModel.create({
      fileName:file.filename,
      fileSize:file.size,
      mimeType:file.mimetype
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM) //EVERY_10_SECONDS
  async remove(id: number) {
    const directory = path.join(__dirname,"../images");
    const files = await fs.readdir(directory);
    const user = await this.UserService.findAllUser();
    const conversation = await this.ConversationService.findGroup();
    const conversationList = conversation.filter((v)=>v.image).map((v)=>v.image);
    
    const fileList = user.filter((v)=>v.avatar && typeof v.avatar != 'string')
                         .map((v)=>(v.avatar as FileType).fileName);
                         
    // console.log([...fileList,...conversationList])
    await Promise.all(files.map(async (file)=>{
      if(![...fileList,...conversationList].includes(file)){
        // console.log('remove file',file)
        await fs.unlink(path.join(directory,file))
      }
    }))
    const res = await this.fileModel.deleteMany({
      fileName:{ $nin:[...fileList,...conversationList] }
    })
    console.log('删除文件',res)
  }
}
