import WorkerRender from './render/WorkerRender'
// import WebGLRender from './render/WebGLRender'
import {PlayProps} from './types'

export default class Player {
  constructor(container: HTMLElement) {
    this._ctxRender = new WorkerRender(container)
  }

  private _ctxRender: WorkerRender

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
