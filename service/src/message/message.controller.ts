import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto,CreateMessageDto2 } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('read')
  create(@Body() CreateMessageDto2: CreateMessageDto2,@Req() req) {
    return this.messageService.updateReadStatus(CreateMessageDto2.conversationId,req.user._id);
  }

  @Get('byConversationId')
  findAll(@Query() query:{conversationId: string ,page: number}, @Req() req) {
    return this.messageService.findAll(query,req);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}
