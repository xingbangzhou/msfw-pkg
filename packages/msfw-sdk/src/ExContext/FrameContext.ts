import MsfwContext from '.'

export default class MsfwFrameContext extends MsfwContext {
  constructor() {
    super()

    window.addEventListener('message', this.onMessage, false)

    this.imReady()
  }

  private static instance_?: MsfwFrameContext

  static instance() {
    if (!MsfwFrameContext.instance_) {
      MsfwFrameContext.instance_ = new MsfwFrameContext()
    }

    return MsfwFrameContext.instance_
  }

  protected postMessage(cmd: string, ...args: any[]) {
    window.top?.postMessage({cmd, args}, '*')
  }

  private onMessage = (ev: MessageEvent<any>) => {
    const {source, data} = ev
    if (source !== window.top) return

    try {
      const cmd = data.cmd
      const args = data.args
      if (Array.isArray(args)) {
        this.onCommand(cmd, ...args)
      }
    } catch (error) {
      console.error('MsfwFrameContext', 'onMessage, error: ', error)
    }
  }
}
