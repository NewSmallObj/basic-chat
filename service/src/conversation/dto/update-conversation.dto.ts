import { PartialType } from '@nestjs/mapped-types';
import { CreateConversationDto } from './create-conversation.dto';
import { IsEmpty, IsNotEmpty, IsString, MaxLength, maxLength } from 'class-validator';
// extends PartialType(CreateConversationDto)
export class UpdateConversationDto  {
  @IsNotEmpty({ message: 'id必填' })
  @IsString()
  readonly id: string;

  // @MaxLength(50, { message: '名称最多50个字符' })
  // readonly name: string;

  // @MaxLength(200, { message: '图片最多200个字符' })
  // readonly image: string;

  // @MaxLength(200, { message: '最新消息最多200个字符' })
  // readonly lastMessage: string;
}
