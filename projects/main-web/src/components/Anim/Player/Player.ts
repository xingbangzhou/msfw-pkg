// import WorkerRender from './render/WorkerRender'
import WebGLRender from './render/WebGLRender'
import {PlayProps} from './types'

export default class Player {
  constructor(container: HTMLElement) {
    this._ctxRender = new WebGLRender(container)
  }

  private _ctxRender: WebGLRender

  async load(props: PlayProps) {
    this._ctxRender.load(props)
  }

  play() {
    this._ctxRender.play()
  }

  replay() {
    this._ctxRender.replay()
  }

  stop() {
    this._ctxRender.stop()
  }

  detroy() {
    this._ctxRender.destroy()
  }
}
