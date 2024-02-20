import {DiFrameInfo, DiGLRenderingContext, DiLayerInfo} from '../types'

export default abstract class DiLayer {
  constructor(info: DiLayerInfo) {
    this.info = info
  }

  readonly info: DiLayerInfo

  abstract init(gl: DiGLRenderingContext): Promise<void>

  abstract render(gl: DiGLRenderingContext, frameInfo: DiFrameInfo): void

  abstract clear(gl?: WebGLRenderingContext): void
}
