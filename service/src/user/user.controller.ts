import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../common/decorator/public/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @Public()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('userinfo')
  findUserinfo(@Req() req) {
    return this.userService.findUserinfo(req);
  }

  @Get('conversation')
  findUserConversation(@Req() req) {
    return this.userService.findConversation(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Get()
  findAll(@Req() req) {
    return this.userService.findAll(req);
  }


  @Post('add_conversation')
  addConversation(@Body() body : {participants: string[],conversationId: string}) {
    return this.userService.addConversation(body.participants,body.conversationId);
  }

  @Put()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }

  @Delete()
  remove(@Body() { id }: { id: string }) {
    return this.userService.remove(id);
  }

  @Post('remove_conversation')
  removeConversationById(@Body() { id }: { id: string }, @Req() req) {
    return this.userService.removeConversationById(id, req);
  }
}
