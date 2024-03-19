import PlayBus from '../PlayBus'
import {ThisWebGLContext, drawTexture} from '../base'
import {Mat4} from '../base/m4'
import {FrameInfo, LayerRectProps} from '../types'
import AbstractDrawer from './AbstractDrawer'

export default class PathDrawer extends AbstractDrawer<LayerRectProps> {
  constructor(props: LayerRectProps, playBus: PlayBus) {
    super(props, playBus)
    this.props.width = props.elements.rectInfo.size[0] || 0
    this.props.height = props.elements.rectInfo.size[1] || 0
  }

  private _texture: WebGLTexture | null = null

  async init(gl: ThisWebGLContext) {}

  draw(gl: ThisWebGLContext, matrix: Mat4, frameInfo: FrameInfo, parentFramebuffer: WebGLFramebuffer | null) {
    if (!this._texture) return

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this._texture)
    gl.uniformMatrix4fv(gl.uniforms.matrix, false, matrix)

    const width = this.width
    const height = this.height
    drawTexture(gl, width, height)
  }

  destroy(gl?: ThisWebGLContext | undefined): void {
    gl?.deleteTexture(this._texture || null)
    this._texture = null
  }
}
