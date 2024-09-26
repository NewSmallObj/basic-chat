import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateConversationDto {
  @IsNotEmpty({ message: '发送者id必填' })
  @IsString()
  readonly senderId: string;

  @IsNotEmpty({ message: '接收者id必填' })
  @IsString()
  readonly receiverId: string;
}

export class CreateConversationGroupDto {
  @IsNotEmpty({ message: '会话名称必填' })
  @MaxLength(50, { message: '最多50个字符' })
  @IsString()
  readonly name: string;

  @IsNotEmpty({ message: '群成员必填' })
  @IsString()
  readonly participantsIds: string;
}
