import {DiFrameInfo, DiGLRenderingContext, DiLayerInfo} from '../types'

export default abstract class DiModel {
  constructor(layerInfo: DiLayerInfo) {
    this.layerInfo = layerInfo
  }

  readonly layerInfo: DiLayerInfo

  abstract init(gl: DiGLRenderingContext): Promise<void>

  abstract render(gl: DiGLRenderingContext, frameInfo: DiFrameInfo): void

  abstract clear(gl?: WebGLRenderingContext): void
}
