import {ThisWebGLContext, createTexture, drawVideo, m4} from '../base'
import MP4Decoder from '../base/decoder/MP4Decoder'
import {FrameInfo, LayerVideoProps} from '../types'
import AbstractDrawer from './AbstractDrawer'

export default class VideoDrawer extends AbstractDrawer<LayerVideoProps> {
  private _texture: WebGLTexture | null = null
  private decoder: MP4Decoder | null = null

  get url() {
    return this.props.content || ''
  }

  async init(gl: ThisWebGLContext) {
    this._texture = createTexture(gl)
    this.decoder = new MP4Decoder(this.url)
  }

  async draw(gl: ThisWebGLContext, matrix: m4.Mat4, frameInfo: FrameInfo) {
    if (!this._texture || !this.decoder) return

    this.decoder.seek(frameInfo.frameId * this.playContext.frameInterval)
    const hasFrame = this.decoder.rendVideoFrame(gl, this._texture)
    if (hasFrame) {
      gl.uniformMatrix4fv(gl.uniforms.matrix, false, matrix)
      if (this.props.isAlpha) gl.uniform1i(gl.uniforms.maskMode, 3)

      const width = this.width
      const height = this.height
      drawVideo(gl, width, height, this.props.isAlpha)

      gl.uniform1i(gl.uniforms.maskMode, 0)
    }
  }

  destroy(gl?: ThisWebGLContext | undefined) {
    gl?.deleteTexture(this._texture)
    this._texture = null
  }
}
