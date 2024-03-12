import {PlayProps, PlayState} from './types'
import WebGLRender from './render/WebGLRender'
import Parser from './base/parser'

export default class Player {
  constructor(container: HTMLElement, props: PlayProps) {
    this.requestAnim = this.requestAnimFunc()

    const parser = (this.parser = new Parser(props))
    this.ctxRender = new WebGLRender()

    this.ctxRender.setContainer(container)
    this.ctxRender.setRenderInfo(parser.width, parser.height, parser.rootLayers)
  }

  private parser: Parser
  private ctxRender: WebGLRender

  protected frameAnimId: any
  protected requestAnim: (cb: () => void) => any
  private frameIndex = -1
  private playState = PlayState.None

  play() {
    if (this.playState === PlayState.None) {
      this.render()
    }
  }

  clear() {
    this.cancelRequestAnimation()

    this.ctxRender.clear()

    this.playState = PlayState.None
  }

  protected render = (_?: unknown, info?: any) => {
    this.frameIndex++
    if (this.frameIndex === this.parser.frames) {
      this.frameIndex = 0
    }
    const frameInfo = {
      frames: this.parser.frames,
      frameId: this.frameIndex,
      width: this.parser.width,
      height: this.parser.height,
    }

    this.ctxRender.render(frameInfo)

    this.frameAnimId = this.requestAnim(this.render)
  }

  private requestAnimFunc = () => {
    return (cb: () => void) => {
      return setTimeout(cb, 1000 / this.parser.frameRate)
    }
  }

  private cancelRequestAnimation() {
    if (!this.frameAnimId) return
    clearTimeout(this.frameAnimId)
    this.frameAnimId = null
  }
}
