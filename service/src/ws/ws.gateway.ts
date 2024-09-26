import { WebSocketGateway, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WsService } from './ws.service';
import { MessageType } from 'src/message/entities/message.entity';
@WebSocketGateway({ core: true })
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(private readonly wsService: WsService) { }


  // server 实例
  @WebSocketServer()
  server: Server;
  /**
   * 用户连接上
   * @param client client
   * @param args
   */
  handleConnection(client: Socket, ...args: any[]) {
    // 注册用户
    const token = client.handshake?.auth?.token ?? client.handshake?.headers?.authorization
    return this.wsService.login(client, token)
  }

  /**
   * 用户断开
   * @param client client
   */
  handleDisconnect(client: Socket) {
    // 移除数据 socketID
    this.wsService.logout(client)
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: { participants: string[], message: MessageType }): void {
    this.wsService.sendMessage(client, payload)
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, payload: any): void {
    // 加入房间
    client.join(payload);
  }

  /**
   * 初始化
   * @param server
   */
  afterInit(server: Server) {
    Logger.log('websocket init... port: ' + process.env.PORT)
    this.wsService.server = server;
    // 重置 socketIds
    this.wsService.resetClients()
  }

}
