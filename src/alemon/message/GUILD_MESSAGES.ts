import { IOpenAPI, IGuild } from 'qq-guild-bot'
import { EventEmitter } from 'ws'
import { AvailableIntentsEventsEnum } from 'qq-guild-bot'
import { BotType, BotConfigType, EventType, EType } from 'alemon'

/* 非依赖引用 */
import { AlemonMsgType } from '../types'
import { guildMessges } from './guildMessges'

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
GUILD_MESSAGES (1 << 9)    // 消息事件，仅 *私域* 机器人能够设置此 intents。
  - MESSAGE_CREATE         
  // 频道内的全部消息，
  而不只是 at 机器人的消息。
  内容与 AT_MESSAGE_CREATE 相同
  - MESSAGE_DELETE         // 删除（撤回）消息事件
 * */
export const GUILD_MESSAGES = (cfg: BotConfigType) => {
  ws.on(AvailableIntentsEventsEnum.GUILD_MESSAGES, async (e: AlemonMsgType) => {
    if (cfg.sandbox) console.info(e)

    // 撤回转交为公域监听处理

    if (new RegExp(e.eventType).test('/^MESSAGE_DELETE$/')) return

    // 艾特机器人消息转交为公域监听处理
    if (new RegExp(`<@!${robot.user.id}>`).test(e.msg.content)) return

    /* 事件匹配 */
    e.event = EType.MESSAGES

    /* 类型匹配 */
    e.eventType = EventType.CREATE

    /* 是私域 */
    e.isPrivate = true

    /* 测回消息 */
    e.isRecall = false

    /* 消息方法 */
    guildMessges(cfg, e).catch((err: any) => console.error(err))
  })
}
