import {PlayProps, PlayState} from './types'
import WebGLRender from './render/WebGLRender'
import PlayContext from './PlayContext'

export default class Player {
  constructor(container: HTMLElement) {
    this._playContext = new PlayContext()
    this._ctxRender = new WebGLRender()
    this._ctxRender.setContainer(container)
  }

  private _playContext: PlayContext
  private _ctxRender: WebGLRender

  protected frameAnimId: any
  protected requestAnim?: (cb: () => void) => any
  private _playState = PlayState.None

  async load(props: PlayProps) {
    this._playContext.setPlayProps(props)
    this.requestAnim = this.requestAnimFunc()

    const result = await this._ctxRender.load(this._playContext)
    return result
  }

  play() {
    if (this._playState === PlayState.None) {
      this._playState = PlayState.Play
      this.render()
    }
  }

  replay() {
    this.stop()
    this.play()
  }

  stop() {
    this.cancelRequestAnimation()
    this._playState = PlayState.None
  }

  detroy() {
    this.cancelRequestAnimation()

    this._ctxRender.destroy()
    this._playState = PlayState.None
  }

  protected render = () => {
    if (this._playContext.frameId === -1) {
      this._playContext.frameId = 0
    } else {
      this._playContext.frameId = this._playContext.frameId + 1
      if (this._playContext.frameId >= this._playContext.frames) {
        this._playContext.frameId = 0
      }
    }

    const frameInfo = {
      frames: this._playContext.frames,
      frameId: this._playContext.frameId,
      width: this._playContext.width,
      height: this._playContext.height,
      opacity: 1.0,
    }
    this._ctxRender.render(frameInfo)

    this.frameAnimId = this.requestAnim?.(this.render)
  }

  private requestAnimFunc = () => {
    return (cb: () => void) => {
      return setTimeout(cb, this._playContext.frameInterval)
    }
  }

  private cancelRequestAnimation() {
    if (!this.frameAnimId) return
    clearTimeout(this.frameAnimId)
    this.frameAnimId = null
  }
}
