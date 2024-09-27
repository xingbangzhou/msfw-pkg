import {MsfwEventListener} from '@msfw/utils/types'
import EventEmitter from '@msfw/utils/EventEmitter'

export default class MsfwEvents {
  constructor() {}

  private _emitter = new EventEmitter()

  postEvent(event: string, ...args: any[]) {
    this._emitter.emit(event, ...args, event)
  }

  addListener(event: string, listener: MsfwEventListener) {
    return this._emitter.on(event, listener)
  }

  removeListener(event: string, listener: MsfwEventListener) {
    this._emitter.off(event, listener)
  }
}
