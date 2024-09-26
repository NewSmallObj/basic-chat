import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserType } from '../user/entities/user.entity';
import { Socket } from 'socket.io';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  createToken(user: Partial<UserType>) {
    return this.jwtService.sign(user);
  }

  async decodeToken(token: string) {
    return this.jwtService.decode(token.replace('Bearer ', ''));
  }

  async login(user: Partial<CreateAuthDto>) {
    const userInfo = await this.userService.findByUsername(user.username);
    const token = this.createToken({
      _id: userInfo.id,
      username: userInfo.username,
    });
    // if(userInfo.status !== 1){
    //   throw new HttpException('账号已被禁用',500)
    // }
    return { token, user: userInfo };
  }

  async logout(client: Socket) {
    // return await this..create(user);
  }
}
