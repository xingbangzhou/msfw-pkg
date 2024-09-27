import MsfwContext from './'

export default class MsfwIFrameContext extends MsfwContext {
  constructor() {
    super()

    window.addEventListener('message', this.onMessage, false)

    this.imReady()
  }

  private static instance_?: MsfwIFrameContext

  static instance() {
    if (!this.instance_) {
      MsfwIFrameContext.instance_ = new MsfwIFrameContext()
    }

    return MsfwIFrameContext.instance_ as MsfwIFrameContext
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
      console.error('MsfwIFrameContext', 'onMessage, error: ', error)
    }
  }
}
