import MsfwModule from './Module'
import MsfwModuleContext from './ModuleContext'
import {MsfwDestructor} from '../utils'
import {MsfwSdkCommand, MsfwFrameworkCommand} from '@msfw/utils/constants'

export default abstract class MsfwExModule extends MsfwModule {
  constructor(ctx: MsfwModuleContext, destructor: MsfwDestructor) {
    super(ctx, destructor)
  }

  private _enabled = false

  get enabled() {
    return this._enabled
  }

  onCommand(cmd: MsfwSdkCommand, ...args: any[]) {
    this.ctx.logger.log('MsfwExModule', 'onCommand: ', cmd, ...args)

    switch (cmd) {
      case MsfwSdkCommand.Ready:
        this._enabled = true
        this.imReady()
        break
      case MsfwSdkCommand.Log:
        {
          const [name, ...params] = args
          this.ctx.log(name, ...params)
        }
        break
      case MsfwSdkCommand.Link:
        {
          const [clazz] = args
          this.ctx.link(clazz, this.onLinkStatus)
        }
        break
      case MsfwSdkCommand.Unlink:
        {
          const [clazz] = args
          this.ctx.unlink(clazz, this.onLinkStatus)
        }
        break
      case MsfwSdkCommand.Invoke:
        {
          const [id, clazz, name, ...params] = args
          this.onInvoke(id, clazz, name, ...params)
        }
        break
      case MsfwSdkCommand.ConnectSignal:
        {
          const [clazz, signal] = args
          this.ctx.connectSignal(clazz, signal, this.onSignal)
        }
        break
      case MsfwSdkCommand.DisconnectSignal:
        {
          const [clazz, signal] = args
          this.ctx.disconnectSignal(clazz, signal, this.onSignal)
        }
        break
      case MsfwSdkCommand.AddEventListener:
        {
          const [event] = args
          this.ctx.addEventListener(event, this.handleEvent)
        }
        break
      case MsfwSdkCommand.RemoveEventListener:
        {
          const [event] = args
          this.ctx.removeEventListener(event, this.handleEvent)
        }
        break
      case MsfwSdkCommand.PostEvent:
        {
          const [event, ...params] = args
          this.ctx.postEvent(event, ...params)
        }
        break
      case MsfwSdkCommand.InvokeExt:
        {
          const [id, name, ...params] = args
          this.onInvokeExt(id, name, ...params)
        }
        break
      case MsfwSdkCommand.OnExtEvent:
        {
          const [event] = args
          this.ctx.onExtEvent(event, this.handleExtEvent)
        }
        break
      case MsfwSdkCommand.OffExtEvent:
        {
          const [event] = args
          this.ctx.offExtEvent(event, this.handleExtEvent)
        }
        break
      case MsfwSdkCommand.EmitExtEvent:
        {
          const [event, ...params] = args
          this.ctx.emitExtEvent(event, ...params)
        }
        break
    }
  }

  protected imReady() {
    this.postMessage(MsfwFrameworkCommand.Ready)
  }

  protected abstract postMessage(cmd: string, ...args: any[]): void

  private async onInvoke(id: string, clazz: string, name: string, ...args: any[]) {
    const result = await this.ctx.invoke(clazz, name, ...args)
    this.postMessage(MsfwFrameworkCommand.InvokeResult, id, result)
  }

  private onLinkStatus = (on: boolean, clazz: string) => {
    this.postMessage(MsfwFrameworkCommand.LinkStatus, on, clazz)
  }

  private onSignal = (...args: any[]) => {
    this.postMessage(MsfwFrameworkCommand.Signal, ...args)
  }

  private handleEvent = (...args: any[]) => {
    this.ctx.logger.log('MsfwExModule', 'onEvent: ', ...args)

    this.postMessage(MsfwFrameworkCommand.Event, ...args)
  }

  private async onInvokeExt(id: string, name: string, ...args: any[]) {
    const result = await this.ctx.invokeExt(name, ...args)
    this.postMessage(MsfwFrameworkCommand.InvokeResult, id, result)
  }

  private handleExtEvent = (...args: any[]) => {
    this.ctx.logger.log('MsfwExModule', 'handleCtxEvent: ', ...args)

    this.postMessage(MsfwFrameworkCommand.ExtEvent, ...args)
  }

  protected unload() {
    super.unload()
    this._enabled = false
  }
}
