import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty({ message: '发送者id必填' })
  @IsString()
  readonly senderId: string;

  @IsNotEmpty({ message: '接收者id必填' })
  @IsString()
  readonly receiverId: string;

  @IsNotEmpty({ message: '会话id必填' })
  @IsString()
  readonly conversationId: string;

  readonly body?: string;

  readonly image?: string;
}


export class CreateMessageDto2 {
  @IsNotEmpty({ message: '会话id必填' })
  @IsString()
  conversationId: string
}