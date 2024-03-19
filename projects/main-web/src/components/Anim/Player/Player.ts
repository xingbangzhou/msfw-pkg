import {PlayProps, PlayState} from './types'
import WebGLRender from './render/WebGLRender'
import PlayData from './PlayData'

export default class Player {
  constructor(container: HTMLElement, props: PlayProps) {
    this.requestAnim = this.requestAnimFunc()

    const pdata = (this.pdata = new PlayData(props))
    this.ctxRender = new WebGLRender(pdata)

    this.ctxRender.setContainer(container)
    this.ctxRender.setRenderInfo(pdata.width, pdata.height, pdata.rootLayers)
  }

  private pdata: PlayData
  private ctxRender: WebGLRender

  protected frameAnimId: any
  protected requestAnim: (cb: () => void) => any
  private frameIndex = -1
  private playState = PlayState.None

  play() {
    if (this.playState === PlayState.None) {
      this.playState = PlayState.Play
      this.render()
    }
  }

  clear() {
    this.cancelRequestAnimation()
    this.ctxRender.destroy()

    this.playState = PlayState.None
  }

  private _startTime = 0
  protected render = (_?: unknown, info?: any) => {
    if (!this._startTime) {
      this._startTime = new Date().getTime()
      this.frameIndex = 0
    } else {
      this.frameIndex = Math.floor((new Date().getTime() - this._startTime) * this.pdata.frameRate * 0.001)
      if (this.frameIndex >= this.pdata.frames) {
        this.frameIndex = this.pdata.frames
      }
    }

    const frameInfo = {
      frames: this.pdata.frames,
      frameId: this.frameIndex,
      width: this.pdata.width,
      height: this.pdata.height,
      opacity: 1.0,
    }

    this.ctxRender.render(frameInfo)

    this.frameAnimId = this.requestAnim(this.render)
  }

  private requestAnimFunc = () => {
    return (cb: () => void) => {
      return setTimeout(cb, 1000 / this.pdata.frameRate)
    }
  }

  private cancelRequestAnimation() {
    if (!this.frameAnimId) return
    clearTimeout(this.frameAnimId)
    this.frameAnimId = null
  }
}
