import {
  MsfwEventListener,
  MsfwLinkFn,
  MsfwSlotFn,
  MsfwExtHandler,
  MsfwService,
  MsfwContextFuncs,
} from '@msfw/utils/types'
import {MsfwSdkCommand, MsfwFrameworkCommand} from '@msfw/utils/constants'
import InvokePool from './InvokePool'

export default abstract class MsfwExContext implements MsfwContextFuncs {
  constructor() {}

  private _fwReady = false
  private _ensurePromise: Promise<void> | null = null
  private _ensureResolve?: () => void

  private _clazzLinks: Record<string, MsfwLinkFn[]> = {}
  private _clazzSlots: [string, string, MsfwSlotFn[]][] = []
  private _eventListeners: Record<string, MsfwEventListener[]> = {}
  private _extEventListeners: Record<string, MsfwEventListener[]> = {}
  private _invokePool = new InvokePool()

  async ensure(overMs = 800) {
    if (this._fwReady) return

    if (this._ensurePromise) {
      return this._ensurePromise
    }

    this._ensurePromise = new Promise<void>(resolve => {
      this._ensureResolve = resolve

      setTimeout(() => {
        this._ensureResolve = undefined
        resolve()
      }, overMs)
    })

    return this._ensurePromise
  }

  log(name: string, ...args: any[]) {
    this.command(MsfwSdkCommand.Log, name, ...args)
  }

  register(service: MsfwService): void {
    service
    console.error("[MfxExContext]: don't realize registerService")
  }

  unregister(service: MsfwService): void {
    service
    console.error("[MfxExContext]: don't realize unregisterService")
  }

  link(clazz: string, linker: MsfwLinkFn) {
    const links = this._clazzLinks[clazz]
    if (links?.length) {
      links.includes(linker) || links.push(linker)
      return
    }

    this._clazzLinks[clazz] = [linker]
    this.command(MsfwSdkCommand.Link, clazz)
  }

  unlink(clazz: string, linker: MsfwLinkFn) {
    const links = this._clazzLinks[clazz]
    if (!links) return
    const idx = links.indexOf(linker)
    if (idx !== -1) {
      links.splice(idx, 1)
      if (!links.length) {
        delete this._clazzLinks[clazz]
        this.command(MsfwSdkCommand.Unlink, clazz)
      }
    }
  }

  async invoke(clazz: string, name: string, ...args: any[]) {
    const result = await this.invoke0(MsfwSdkCommand.Invoke, clazz, name, ...args)
    return result
  }

  connectSignal(clazz: string, signal: string, slot: MsfwSlotFn) {
    const slots = this._clazzSlots.find(el => el[0] === clazz && el[1] === signal)?.[2]
    if (slots?.length) {
      slots.push(slot)
      return
    }

    this._clazzSlots.push([clazz, signal, [slot]])
    this.command(MsfwSdkCommand.ConnectSignal, clazz, signal)
  }

  disconnectSignal(clazz: string, signal: string, slot: MsfwSlotFn) {
    const clazzSlots: [string, string, MsfwSlotFn[]][] = []

    for (let i = 0, l = this._clazzSlots.length; i < l; i++) {
      const si = this._clazzSlots[i]
      if (si[0] === clazz && si[1] === signal) {
        const sl = si[2]
        const idx = sl.indexOf(slot)
        if (idx !== -1) {
          sl.splice(idx, 1)
          if (!sl.length) {
            this.command(MsfwSdkCommand.DisconnectSignal, clazz, signal)
            continue
          }
        }
      }
      clazzSlots.push(si)
    }

    this._clazzSlots = clazzSlots
  }

  addEventListener(event: string, listener: MsfwEventListener) {
    const listeners = this._eventListeners[event]
    if (listeners?.length) {
      listeners.push(listener)
      return
    }

    this._eventListeners[event] = [listener]
    this.command(MsfwSdkCommand.AddEventListener, event)
  }

  removeEventListener(event: string, listener: MsfwEventListener) {
    const listeners = this._eventListeners[event]
    if (!listeners) return
    const idx = listeners.indexOf(listener)
    if (idx !== -1) {
      listeners.splice(idx, 1)
      if (!listeners.length) {
        delete this._eventListeners[event]
        this.command(MsfwSdkCommand.RemoveEventListener, event)
      }
    }
  }

  postEvent(event: string, ...args: any[]) {
    this.command(MsfwSdkCommand.PostEvent, event, ...args)
  }

  setExtHandler(name: string, fn?: MsfwExtHandler) {
    name
    fn
    console.error("[MfxExContext]: don't realize ctxSetHandler")
  }

  async invokeExt(name: string, ...args: any[]) {
    const fn = (this as any)[name]
    if (typeof fn === 'function') {
      return await fn.call(this, ...args)
    }

    return await this.invoke0(MsfwSdkCommand.InvokeExt, name, ...args)
  }

  onExtEvent(event: string, listener: MsfwEventListener) {
    const listeners = this._extEventListeners[event]
    if (listeners?.length) {
      listeners.push(listener)
      return
    }

    this._extEventListeners[event] = [listener]
    this.command(MsfwSdkCommand.OnExtEvent, event)
  }

  offExtEvent(event: string, listener: MsfwEventListener) {
    const listeners = this._extEventListeners[event]
    if (!listeners) return
    const idx = listeners.indexOf(listener)
    if (idx !== -1) {
      listeners.splice(idx, 1)
      if (!listeners.length) {
        delete this._extEventListeners[event]
        this.command(MsfwSdkCommand.OffExtEvent, event)
      }
    }
  }

  emitExtEvent(event: string, ...args: any[]) {
    this.command(MsfwSdkCommand.EmitExtEvent, event, ...args)
  }

  protected abstract postMessage(cmd: string, ...args: any[]): void

  protected imReady() {
    this.postMessage(MsfwSdkCommand.Ready)
  }

  protected onCommand = (cmd: string, ...args: any[]) => {
    switch (cmd) {
      case MsfwFrameworkCommand.Ready:
        this.onFwReady()
        break
      case MsfwFrameworkCommand.LinkStatus:
        const [on, clazz] = args
        this.onLinkStatus(on, clazz)
        break
      case MsfwFrameworkCommand.InvokeResult:
        const [id, result] = args
        this.onInvokeResult(id, result)
        break
      case MsfwFrameworkCommand.Signal:
        this.onSignal(...args)
        break
      case MsfwFrameworkCommand.Event:
        this.handleEvent(...args)
        break
      case MsfwFrameworkCommand.ExtEvent:
        this.handleExtEvent(...args)
        break
      default:
        break
    }
  }

  private command(cmd: string, ...args: any[]) {
    if (this._fwReady) {
      this.postMessage(cmd, ...args)
      return
    }
  }

  private onFwReady() {
    if (this._fwReady) return
    this._fwReady = true

    this.log('MsfwSDK', 'MfxExContext.onFwReady is runned')

    // handle ensures
    this._ensureResolve?.()
  }

  private onLinkStatus(on: boolean, clazz: string) {
    const links = this._clazzLinks?.[clazz]
    links?.forEach(el => el(on, clazz))
  }

  private onInvokeResult(id: string, result: any) {
    this._invokePool.resolve(id, result)
  }

  private onSignal(...args: any[]) {
    const [clazz, signal] = args.slice(-2)
    const slots = this._clazzSlots.find(el => el[0] === clazz && el[1] === signal)?.[2]
    slots?.forEach(el => el(...args))
  }

  private handleEvent(...args: any[]) {
    const [event] = args.slice(-1)
    const listeners = this._eventListeners[event]
    listeners?.forEach(el => el(...args))
  }

  private handleExtEvent(...args: any[]) {
    const [event] = args.slice(-1)
    const listeners = this._extEventListeners[event]
    listeners?.forEach(el => el(...args))
  }

  private async invoke0(cmd: string, ...args: any[]) {
    const {id, result} = this._invokePool.invoke(...args)
    this.command(cmd, id, ...args)

    return result
  }
}
