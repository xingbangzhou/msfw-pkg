import {DiPlayProps, DiPlayState} from './types'
import DiGLRender from './render/GLRender'
import DiParser from './Parser'

export default class DiPlayer {
  constructor(container: HTMLElement, props: DiPlayProps) {
    this.requestAnim = this.requestAnimFunc()

    const parser = (this.parser = new DiParser(props))
    this.glRender = new DiGLRender()

    this.glRender.setContainer(container)
    this.glRender.setRenderInfo(parser.width, parser.height, parser.rootLayers)
  }

  private parser: DiParser
  private glRender: DiGLRender

  protected frameAnimId: any
  protected requestAnim: (cb: () => void) => any
  private frameIndex = -1
  private playState = DiPlayState.None

  play() {
    if (this.playState === DiPlayState.None) {
      this.render()
    }
  }

  clear() {
    this.cancelRequestAnimation()

    this.glRender.clear()

    this.playState = DiPlayState.None
  }

  protected render = (_?: unknown, info?: any) => {
    this.frameIndex++
    if (this.frameIndex === this.parser.frames) {
      this.frameIndex = 0
    }
    const frameInfo = {frameId: this.frameIndex, width: this.parser.width, height: this.parser.height}

    this.glRender.render(frameInfo)

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
