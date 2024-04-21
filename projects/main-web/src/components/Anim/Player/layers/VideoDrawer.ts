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

    const time = (frameInfo.frameId - this.inFrame) * this.playData.frameTime
    this.decoder.seek(time)
    const videoFrame = this.decoder.videoFrame
    if (videoFrame) {
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, this._texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, videoFrame)

      gl.uniformMatrix4fv(gl.uniforms.matrix, false, matrix)
      gl.uniform1i(gl.uniforms.isAlpha, this.props.isAlpha ? 1 : 0)

      const width = this.width
      const height = this.height
      drawVideo(gl, width, height, this.props.isAlpha)

      gl.bindTexture(gl.TEXTURE_2D, null)
      gl.uniform1i(gl.uniforms.isAlpha, 0)
    }
  }

  destroy(gl?: ThisWebGLContext | undefined) {
    gl?.deleteTexture(this._texture)
    this._texture = null
    this.decoder?.destroy()
    this.decoder = null
  }
}
