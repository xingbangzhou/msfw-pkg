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

let lastInstanceId = 0

export default class WorkerRender {
  private static _worker?: Worker
  protected static worker() {
    if (!this._worker) {
      this._worker = new Worker(new URL('./worker.ts', import.meta.url))
    }
    return this._worker
  }

  constructor(container: HTMLElement) {
    this.worker = WorkerRender.worker()

    lastInstanceId++
    if (lastInstanceId >= 2100000000) {
      lastInstanceId = 0
    }
    this._instanceId = lastInstanceId
    console.log('create WorkerRender: ', this._instanceId)

    this._canvas = document.createElement('canvas')
    container.appendChild(this._canvas)

    const offscreenCanvas = this._canvas.transferControlToOffscreen()

    invokeWorkerFn(this.worker, 'instance', {id: this._instanceId, canvas: offscreenCanvas}, [offscreenCanvas])
  }

  protected worker: Worker
  private _instanceId: number
  private _canvas?: HTMLCanvasElement

  load(props: PlayProps) {
    invokeWorkerFn(this.worker, 'load', {id: this._instanceId, props})

    this.resize()
  }

  resize() {
    const canvas = this._canvas
    if (!canvas) return
    const width = canvas.clientWidth | 0
    const height = canvas.clientHeight | 0

    invokeWorkerFn(this.worker, 'resize', {id: this._instanceId, width, height})
  }

  play() {
    invokeWorkerFn(this.worker, 'play', {id: this._instanceId})
  }

  replay() {
    invokeWorkerFn(this.worker, 'replay', {id: this._instanceId})
  }

  stop() {
    invokeWorkerFn(this.worker, 'stop', {id: this._instanceId})
  }

  destroy() {
    invokeWorkerFn(this.worker, 'destroy', {id: this._instanceId})

    this._canvas?.parentNode?.removeChild(this._canvas)
    this._canvas = undefined
  }
}
