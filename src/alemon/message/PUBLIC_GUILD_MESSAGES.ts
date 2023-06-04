import { IOpenAPI, IGuild } from 'qq-guild-bot'
import { EventEmitter } from 'ws'
import { AvailableIntentsEventsEnum } from 'qq-guild-bot'
import { BotType, EType, typeMessage, EventType, BotConfigType } from 'alemon'

/* 非依赖引用 */
import { AlemonMsgType } from '../types'

import { guildMessges } from './GUILD_MESSAGE'

declare global {
  //接口对象
  var client: IOpenAPI
  //连接对象
  var ws: EventEmitter
  //机器人信息
  var robot: BotType
  //频道管理
  var guilds: Array<IGuild>
  //机器人配置
  var cfg: BotConfigType
}

/**
 PUBLIC_GUILD_MESSAGES (1 << 30) // 消息事件，此为公域的消息事件
 AT_MESSAGE_CREATE       // 当收到@机器人的消息时
 PUBLIC_MESSAGE_DELETE   // 当频道的消息被删除时
 */
export const PUBLIC_GUILD_MESSAGES = () => {
  ws.on(AvailableIntentsEventsEnum.PUBLIC_GUILD_MESSAGES, async (e: AlemonMsgType) => {
    /* 是否是公域：私域 */
    e.isPrivate = false
    if (new RegExp(e.eventType).test('/CREATE$/')) {
      /* 是否是撤回：不是 */
      e.isRecall = false
      guildMessges(e).catch((err: any) => console.error(err))
    }
    if (new RegExp(e.eventType).test('/DELETE$/')) {
      e.event = EType.MESSAGES
      e.eventType = EventType.DELETE
      /* 测回消息：是 */
      e.isRecall = true
      typeMessage(e)
    }
  })
}
