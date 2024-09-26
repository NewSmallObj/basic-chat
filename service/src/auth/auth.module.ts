import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStorage } from './local.strategy';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import userSchema from '../user/entities/user.entity';

const jwtModule = JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      secret: configService.get('SECRET', 'my-chat-app'),
      signOptions: {
        expiresIn: '4h',
      },
    };
  },
});

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Users', schema: userSchema }]),
    jwtModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, LocalStorage],
  exports: [AuthService],
})
export class AuthModule {}
