import {PlayProps} from '../../types'

// 线程执行函数映射
export class WorkerFunctionMap {
  instance: {id: number; canvas: OffscreenCanvas} = null as any
  load: {id: number; props: PlayProps} = null as any
  play: {id: number} = null as any
  replay: {id: number} = null as any
  stop: {id: number} = null as any
  destroy: {id: number} = null as any
  resizeCanvasToDisplaySize: {id: number; width: number; height: number} = null as any
}

export class WorkerMessageMap {}
