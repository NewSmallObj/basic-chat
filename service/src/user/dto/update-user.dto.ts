// import { PartialType } from '@nestjs/mapped-types';
// import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, MaxLength } from 'class-validator';
// extends PartialType(CreateUserDto)

export class UpdateUserDto  {
  @IsNotEmpty({ message: 'id必填' })
  readonly id: string;

  @IsNotEmpty({ message: '昵称必填'})
  @MaxLength(20, { message: '昵称长度不能超过20' })
  readonly name: string;
  
  // @IsNotEmpty({ message: '签名必填'})
  @MaxLength(200, { message: '签名长度不能超过200' })
  readonly remark: string;

  readonly avatar: string;
}
