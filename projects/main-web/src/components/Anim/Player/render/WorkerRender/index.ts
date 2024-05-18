import {PlayProps} from '../../types'
import {WorkerFunctionMap} from './types'

const mapIds: Record<string, number> = {}
function createId(name: string) {
  let lastId = mapIds[name] || 0
  lastId++
  if (lastId >= 2100000000) {
    lastId = 0
  }
  mapIds[name] = lastId
  return lastId
}

export default class WorkerRender {
  private static worker_?: Worker

  constructor(container: HTMLElement) {
    this._id = createId('WorkerRender')

    this._canvas = document.createElement('canvas')
    container.appendChild(this._canvas)
    const offscreenCanvas = this._canvas.transferControlToOffscreen()

    this.invokeWorker('instance', {id: this._id, canvas: offscreenCanvas}, [offscreenCanvas])
  }

  private _id: number
  private _canvas?: HTMLCanvasElement

  protected async invokeWorker<F extends keyof WorkerFunctionMap>(
    fn: F,
    params: WorkerFunctionMap[F],
    transfer?: Transferable[],
  ) {
    if (!WorkerRender.worker_) {
      WorkerRender.worker_ = new Worker(new URL('./worker.ts', import.meta.url))
    }
    WorkerRender.worker_.postMessage({fn: fn, params}, transfer || [])
  }

  load(props: PlayProps) {
    this.invokeWorker('load', {id: this._id, props})

    this.resizeCanvasToDisplaySize()
  }

  play() {
    this.invokeWorker('play', {id: this._id})
  }

  replay() {
    this.invokeWorker('replay', {id: this._id})
  }

  stop() {
    this.invokeWorker('stop', {id: this._id})
  }

  resizeCanvasToDisplaySize(multiplier?: number) {
    const canvas = this._canvas
    if (!canvas) return

    multiplier = multiplier || 1
    const width = (canvas.clientWidth * multiplier) | 0
    const height = (canvas.clientHeight * multiplier) | 0

    this.invokeWorker('resizeCanvasToDisplaySize', {id: this._id, width, height})
  }

  destroy() {
    this.invokeWorker('destroy', {id: this._id})

    this._canvas?.parentNode?.removeChild(this._canvas)
    this._canvas = undefined
  }
}
