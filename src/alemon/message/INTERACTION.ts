import { IOpenAPI, IGuild } from 'qq-guild-bot'
import { EventEmitter } from 'ws'
import { AvailableIntentsEventsEnum } from 'qq-guild-bot'
import { BotType, BotConfigType, EType, typeMessage } from 'alemon'

/* 非依赖引用 */
import { AlemonMsgType } from '../types'

declare global {
  //接口对象
  var client: IOpenAPI
  //连接对象
  var ws: EventEmitter
  //机器人信息
  var robot: BotType
  //频道管理
  var guilds: Array<IGuild>
}

/**
INTERACTION (1 << 26)
  - INTERACTION_CREATE     // 互动事件创建时
 */
export const INTERACTION = (cfg: BotConfigType) => {
  ws.on(AvailableIntentsEventsEnum.INTERACTION, (e: AlemonMsgType) => {
    if (cfg.sandbox) console.info(e)
    /* 事件匹配 */
    e.event = EType.INTERACTION
    //只匹配类型
    typeMessage(e)
  })
}
