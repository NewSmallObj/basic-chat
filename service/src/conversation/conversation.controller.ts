import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Put,
  Query,
} from '@nestjs/common';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { ConversationService } from './conversation.service';
import {
  CreateConversationDto,
  CreateConversationGroupDto,
} from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) { }

  @Post()
  create(@Body() createConversationDto: CreateConversationDto, @Req() req) {
    return this.conversationService.create(createConversationDto, req);
  }

  @Post('message')
  createMessage(@Body() CreateMessageDto: CreateMessageDto) {
    return this.conversationService.createMessage(CreateMessageDto);
  }

  @Post('group')
  createGroup(
    @Body() CreateConversationGroup: CreateConversationGroupDto,
    @Req() req,
  ) {
    return this.conversationService.createGroup(CreateConversationGroup);
  }

  
  @Get('detail')
  findOne(@Query() query:{id:string}) {
    return this.conversationService.findOne(query.id);
  }


  @Get('group')
  findGroupAll(@Req() req) {
    return this.conversationService.findGroupAll(req);
  }

  // 加入群聊
  @Post('group/join')
  joinGroup(@Body() body:{id: string, userId: string},@Req() req) {
    return this.conversationService.addParticipant(body,req);
  }
  
  // 退出或踢出群聊
  @Post('group/leave')
  leaveGroup(@Body() body:{id: string, userId: string},@Req() req) {
    return this.conversationService.removeParticipant(body,req);
  }


  @Get()
  findAll(@Req() req) {
    return this.conversationService.findAll(req);
  }

  @Put()
  update(@Body() updateConversationDto: UpdateConversationDto) {
    return this.conversationService.update(updateConversationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conversationService.remove(id);
  }
}
