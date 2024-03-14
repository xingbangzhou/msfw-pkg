import {ThisWebGLContext, m4} from '../base'
import {FrameInfo} from '../types'
import Layer from './Layer'

export default abstract class AbstractDrawer {
  constructor(layerRef: Layer) {
    this.layerRef = layerRef
  }

  protected layerRef: Layer

  abstract init(gl: ThisWebGLContext): Promise<void>

  abstract draw(
    gl: ThisWebGLContext,
    matrix: m4.Mat4,
    frameInfo: FrameInfo,
    parentFramebuffer: WebGLFramebuffer | null,
  ): Promise<void>

  abstract destroy(gl?: ThisWebGLContext): void
}
