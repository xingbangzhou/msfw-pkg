import {PlayProps, PlayState} from './types'
import WebGLRender from './render/WebGLRender'
import PlayBus from './PlayBus'

export default class Player {
  constructor(container: HTMLElement) {
    this.requestAnim = this.requestAnimFunc()

    this._playBus = new PlayBus()
    this._ctxRender = new WebGLRender()
    this._ctxRender.setContainer(container)
  }

  private _playBus: PlayBus
  private _ctxRender: WebGLRender

  protected frameAnimId: any
  protected requestAnim: (cb: () => void) => any
  private _frameIndex = -1
  private _playState = PlayState.None

  async load(props: PlayProps) {
    this._playBus.loadProps(props)
    const result = await this._ctxRender.load(this._playBus)
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

  private _startTime = 0
  protected render = (_?: unknown, info?: any) => {
    if (!this._startTime) {
      this._startTime = new Date().getTime()
      this._frameIndex = 0
    } else {
      this._frameIndex = Math.floor((new Date().getTime() - this._startTime) * this._playBus.frameRate * 0.001)
      if (this._frameIndex >= this._playBus.frames) {
        this._frameIndex = this._playBus.frames
      }
    }

    const frameInfo = {
      frames: this._playBus.frames,
      frameId: this._frameIndex,
      width: this._playBus.width,
      height: this._playBus.height,
      opacity: 1.0,
    }

    this._ctxRender.render(frameInfo)

    this.frameAnimId = this.requestAnim(this.render)
  }

  private requestAnimFunc = () => {
    return (cb: () => void) => {
      return setTimeout(cb, 1000 / this._playBus.frameRate)
    }
  }

  private cancelRequestAnimation() {
    if (!this.frameAnimId) return
    clearTimeout(this.frameAnimId)
    this.frameAnimId = null
  }
}
