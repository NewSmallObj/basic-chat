import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: '用户名必填' })
  @IsString({ message: '用户名必填' })
  @MaxLength(50, { message: '最多50个字符' })
  readonly username: string;

  @IsNotEmpty({ message: '昵称必填' })
  @IsString({ message: '昵称必填' })
  @MaxLength(50, { message: '最多50个字符' })
  readonly name: string;

  @IsNotEmpty({ message: '密码必填' })
  @IsString({ message: '密码必填' })
  @MaxLength(50, { message: '最多50个字符' })
  readonly password: string;
}
