import {PlayProps} from '../../types'
import {WorkerFunctionMap} from './types'

function invokeWorkerFn<F extends keyof WorkerFunctionMap>(
  worker: Worker,
  fn: F,
  params: WorkerFunctionMap[F],
  transfer?: Transferable[],
) {
  worker.postMessage({fn: fn, params}, transfer || [])
}

let lastObjId = 0

export default class WorkerRender {
  private static worker_?: Worker

  constructor(container: HTMLElement) {
    lastObjId++
    if (lastObjId >= 2100000000) {
      lastObjId = 0
    }
    this._id = lastObjId

    this._canvas = document.createElement('canvas')
    container.appendChild(this._canvas)
    const offscreenCanvas = this._canvas.transferControlToOffscreen()

    invokeWorkerFn(this.worker, 'instance', {id: this._id, canvas: offscreenCanvas}, [offscreenCanvas])
  }

  private _id: number
  private _canvas?: HTMLCanvasElement

  protected get worker() {
    if (!WorkerRender.worker_) {
      WorkerRender.worker_ = new Worker(new URL('./worker.ts', import.meta.url))
    }
    return WorkerRender.worker_
  }

  load(props: PlayProps) {
    invokeWorkerFn(this.worker, 'load', {id: this._id, props})

    this.resizeCanvasToDisplaySize()
  }

  play() {
    invokeWorkerFn(this.worker, 'play', {id: this._id})
  }

  replay() {
    invokeWorkerFn(this.worker, 'replay', {id: this._id})
  }

  stop() {
    invokeWorkerFn(this.worker, 'stop', {id: this._id})
  }

  resizeCanvasToDisplaySize(multiplier?: number) {
    const canvas = this._canvas
    if (!canvas) return

    multiplier = multiplier || 1
    const width = (canvas.clientWidth * multiplier) | 0
    const height = (canvas.clientHeight * multiplier) | 0

    invokeWorkerFn(this.worker, 'resizeCanvasToDisplaySize', {id: this._id, width, height})
  }

  destroy() {
    invokeWorkerFn(this.worker, 'destroy', {id: this._id})

    this._canvas?.parentNode?.removeChild(this._canvas)
    this._canvas = undefined
  }
}
