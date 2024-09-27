import {
  MsfwEventListener,
  MsfwLinkFn,
  MsfwSlotFn,
  MsfwExtHandler,
  MsfwService,
  MsfwContextFuncs,
} from '@msfw/utils/types'
import Logger from '@msfw/utils/Logger'
import MsfwFrameworkContext from '../Framework/FrameworkContext'
import EventEmitter from '@msfw/utils/EventEmitter'
import {MsfwDestructor} from '../utils'

export default class MsfwModuleContext implements MsfwContextFuncs {
  constructor(moduleId: string, fwCtx: MsfwFrameworkContext, destructor: MsfwDestructor) {
    this.moduleId = moduleId
    this._fwCtx = fwCtx
    destructor.push(this.clearAll.bind(this))

    this.logger = new Logger(this.moduleId)
    this.logger.debug = fwCtx.options?.debug || false
  }

  readonly moduleId: string
  readonly logger: Logger

  private _fwCtx: MsfwFrameworkContext
  private _links?: [string, MsfwLinkFn][]
  private _slots?: [string, string, MsfwSlotFn][]
  private _listeners?: [string, MsfwEventListener][]
  private _extHandlers?: Record<string, MsfwExtHandler | undefined>
  private _extEmitter?: EventEmitter

  register(service: MsfwService) {
    this.logger.log('MsfwModuleContext', 'register: ', service.clazz)
    const {_fwCtx} = this

    return _fwCtx.services.register(this, service)
  }

  unregister(service: MsfwService) {
    this.logger.log('MsfwModuleContext', 'unregister: ', service.clazz)
    const {_fwCtx} = this

    _fwCtx.services.unregister(this, service)
  }

  log(name: string, ...args: any) {
    this.logger.log(name, ...args)
  }

  link(clazz: string, linker: MsfwLinkFn) {
    this.logger.log('MsfwModuleContext', 'link: ', clazz)
    const {_fwCtx} = this

    const l = _fwCtx.services.link(clazz, linker)
    if (!l) return

    if (!this._links) this._links = [[clazz, linker]]
    else if (!this._links.find(el => el[0] === clazz && el[1] === linker)) {
      this._links.push([clazz, linker])
    }

    _fwCtx.services.getService(clazz) && linker(true, clazz)
  }

  unlink(clazz: string, linker: MsfwLinkFn) {
    this.logger.log('MsfwModuleContext', 'unlink: ', clazz)
    const {_fwCtx} = this

    _fwCtx.services.unlink(clazz, linker)

    this._links = this._links?.filter(el => !(el[0] === clazz && el[1] === linker))
  }

  async invoke(clazz: string, name: string, ...args: any[]) {
    this.logger.log('MsfwModuleContext', 'invoke: ', clazz, name, ...args)
    const {_fwCtx} = this

    return _fwCtx.services.invoke(clazz, name, ...args)
  }

  connectSignal(clazz: string, signal: string, slot: MsfwSlotFn) {
    this.logger.log('MsfwModuleContext', 'connectSignal: ', clazz, signal)
    const {_fwCtx} = this

    const l = _fwCtx.services.connectSignal(clazz, signal, slot)
    if (!l) return

    if (!this._slots) this._slots = [[clazz, signal, slot]]
    else if (!this._slots.find(el => el[0] === clazz && el[1] === signal && el[2] === slot)) {
      this._slots.push([clazz, signal, slot])
    }
  }

  disconnectSignal(clazz: string, signal: string, slot: MsfwSlotFn) {
    this.logger.log('MsfwModuleContext', 'disconnectSignal: ', clazz, signal)
    const {_fwCtx} = this

    _fwCtx.services.disconnectSignal(clazz, signal, slot)

    this._slots = this._slots?.filter(el => !(el[0] === clazz && el[1] === signal && el[2] === slot))
  }

  addEventListener(event: string, listener: MsfwEventListener) {
    this.logger.log('MsfwModuleContext', 'addEventListener: ', event)
    const {_fwCtx} = this

    _fwCtx.events.addListener(event, listener)

    if (!this._listeners) this._listeners = [[event, listener]]
    else if (!this._listeners.find(el => el[0] === event && el[1] === listener)) {
      this._listeners.push([event, listener])
    }
  }

  removeEventListener(event: string, listener: MsfwEventListener) {
    this.logger.log('MsfwModuleContext', 'removeEventListener: ', event)
    const {_fwCtx} = this

    _fwCtx.events.removeListener(event, listener)

    this._listeners = this._listeners?.filter(el => !(el[0] === event && el[1] === listener))
  }

  postEvent(event: string, ...args: any[]) {
    this.logger.log('MsfwModuleContext', 'postEvent: ', event, ...args)
    const {_fwCtx} = this

    _fwCtx.events.postEvent(event, ...args)
  }

  setExtHandler(name: string, handler: MsfwExtHandler): void {
    if (!this._extHandlers) this._extHandlers = {[name]: handler}
    else if (!this._extHandlers[name]) {
      this._extHandlers[name] = handler
    }
  }

  async invokeExt(name: string, ...args: any[]) {
    this.logger.log('MsfwModuleContext', 'invokeExt: ', name, ...args)

    const fn = this._extHandlers?.[name]
    if (!fn) return undefined

    const result = await fn.call(this, ...args)
    return result
  }

  onExtEvent(event: string, listener: MsfwEventListener): void {
    this.logger.log('MsfwModuleContext', 'onExtEvent: ', event)

    if (!this._extEmitter) this._extEmitter = new EventEmitter()

    this._extEmitter.on(event, listener)
  }

  offExtEvent(event: string, listener: MsfwEventListener): void {
    this.logger.log('MsfwModuleContext', 'OffExtEvent: ', event)

    this._extEmitter?.off(event, listener)
  }

  emitExtEvent(event: string, ...args: any[]): void {
    this.logger.log('MsfwModuleContext', 'emitExtEvent: ', event, ...args)

    this._extEmitter?.emit(event, ...args, event)
  }

  private clearAll() {
    this.logger.log('MsfwModuleContext', 'clearAll()')

    const {_fwCtx} = this

    this._listeners?.forEach(el => _fwCtx.events.removeListener(el[0], el[1]))
    this._listeners = undefined

    this._slots?.forEach(el => _fwCtx.services.disconnectSignal(el[0], el[1], el[2]))
    this._slots = undefined

    this._links?.forEach(el => _fwCtx.services.unlink(el[0], el[1]))
    this._links = undefined

    _fwCtx.services.unregisterAll(this)

    this._extHandlers = undefined
    this._extEmitter = undefined
  }
}
