import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { MessageType } from 'src/message/entities/message.entity';


@Injectable()
export class WsService {
  constructor(private readonly AuthService: AuthService) {}

  // ws 服务器, gateway 传进来
  server: Server;

  // 存储连接的客户端
  connectedClients: Map<string, Socket> = new Map();
  /**
   * 登录
   * @param client socket 客户端
   * @param token token
   * @returns
   */
  async login(client: Socket, token: string): Promise<void> {
    if (!token) {
      client.send('tokenRrror') // 登陆失效
      client.disconnect() // 题下线
      return
    }
    const res = await this.AuthService.decodeToken(token)
    if(!res){
      client.send('tokenRrror')  // 登陆失效
      client.disconnect()
      return
    }
    
    // 处理同一用户在多处登录
    if (this.connectedClients.get(res._id)) {
      // this.connectedClients.get(res._id).send(`RepeatLogin`) // RepeatLogin 重复登录
      // this.connectedClients.get(res._id).disconnect()
      this.connectedClients.delete(res._id)
      // return
    }
    // 保存用户
    this.connectedClients.set(res._id, client)
    client.send(`${res._id} connected, 在线人数: ${this.connectedClients.size}`)
    return
  }


  // 发送消息
  sendMessage(client: Socket, payload: { participants: string[], message: MessageType }){
    payload.participants.forEach(id => {
      const socket = this.connectedClients.get(id)
      if(socket) socket.emit('response', payload)
    })
  }

   /**
   * 指定群聊发送系统消息
   * @param receiverId 接收者id
   */
    async sendGroupSysMessage(payload: { participants: string[], message: MessageType }, receiverId: string) {
      try {
        const res = this.connectedClients.get(receiverId).emit('response', payload)
        if (!res) {
          Logger.log('websocket send error', payload)
        }
      } catch (error) {
        throw new Error(error?.toString())
      }
    }

  /**
   * 登出
   * @param client client
   */
  async logout(client: Socket) {
    // 移除在线 client
    this.connectedClients.forEach((value, key) => {
      if (value === client) {
        this.connectedClients.delete(key);
      }
    });
  }

  /**
   * 重置 connectedClients
   */
  resetClients() {
    this.connectedClients.clear()
  }

  /**
   * 发送公共消息(系统消息)
   * @param response 响应数据
   */
  async sendPublicMessage(data: {type:number,message:string}) {
    try {
      const res = this.server?.emit('system',data)
      if (!res) {
        Logger.log('websocket send error', data)
      }
    } catch (error) {
      throw new Error(error?.toString())
    }
  }

  /**
   * 指定用户发送私有消息
   * @param receiverId 接收者id
   */
  async sendPrivateMessage(data: {type:number,message:string}, receiverId: string) {
    try {
      const res = this.connectedClients.get(receiverId).emit('system', data)
      if (!res) {
        Logger.log('websocket send error', data)
      }
    } catch (error) {
      throw new Error(error?.toString())
    }
  }

 

}



// 10001 系统级站内信

// 30001 xxx 加入群聊
// 30001 xxx 被管理员提出群
// 30001 xxx 已被管理员解散