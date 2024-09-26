import { compareSync } from 'bcryptjs';
import { PassportStrategy } from '@nestjs/passport';
import { IStrategyOptions, Strategy } from 'passport-local';
import { UserType } from 'src/user/entities/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class LocalStorage extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel('Users') private readonly userModel: Model<UserType>,
  ) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    } as IStrategyOptions);
  }

  async validate(username: string, password: string) {
    const user = await this.userModel
      .findOne({
        username,
      })
      .select('+password');

    if (!user) {
      throw new HttpException('用户名不正确！', HttpStatus.BAD_REQUEST);
    }

    if (!compareSync(password, user.password)) {
      throw new HttpException('密码错误！', HttpStatus.BAD_REQUEST);
    }

    return user;
  }
}
