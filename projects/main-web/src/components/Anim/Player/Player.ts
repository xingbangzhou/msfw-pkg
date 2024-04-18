import {PlayProps, PlayState} from './types'
import WebGLRender from './render/WebGLRender'
import PlayData from './PlayData'

export default class Player {
  constructor(container: HTMLElement) {
    this._playData = new PlayData()
    this._ctxRender = new WebGLRender()
    this._ctxRender.setContainer(container)
  }

  private _playData: PlayData
  private _ctxRender: WebGLRender

  protected frameAnimId: any
  protected requestAnim?: (cb: () => void) => any
  private _playState = PlayState.None

  async load(props: PlayProps) {
    this._playData.setPlayProps(props)
    this.requestAnim = this.requestAnimFunc()

    const result = await this._ctxRender.load(this._playData)
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
    if (this._playData.frameId === -1) {
      this._playData.frameId = 0
    } else {
      this._playData.frameId = this._playData.frameId + 1
      if (this._playData.frameId >= this._playData.frames) {
        this._playData.frameId = 0
      }
    }

    this._ctxRender.render()

    this.frameAnimId = this.requestAnim?.(this.render)
  }

  private requestAnimFunc = () => {
    return (cb: () => void) => {
      return setTimeout(cb, this._playData.frameTime)
    }
  }

  private cancelRequestAnimation() {
    if (!this.frameAnimId) return
    clearTimeout(this.frameAnimId)
    this.frameAnimId = null
  }
}
