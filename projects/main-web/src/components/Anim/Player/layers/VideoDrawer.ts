import {ThisWebGLContext, drawVideo, m4} from '../base'
import MP4Decoder from '../base/decoder/MP4Decoder'
import Texture from '../base/webgl/Texture'
import {FrameInfo, LayerVideoProps} from '../types'
import AbstractDrawer from './AbstractDrawer'

export default class VideoDrawer extends AbstractDrawer<LayerVideoProps> {
  private texture?: Texture
  private decoder?: MP4Decoder

  get url() {
    return this.props.content || ''
  }

  async init(gl: ThisWebGLContext) {
    this.texture = new Texture(gl)
    this.decoder = new MP4Decoder(this.url)
  }

  async draw(gl: ThisWebGLContext, matrix: m4.Mat4, frameInfo: FrameInfo) {
    if (!this.texture || !this.decoder) return

    const time = (frameInfo.frameId - this.inFrame) * this.playData.frameTime
    this.decoder.seek(time)
    const videoFrame = this.decoder.videoFrame
    if (videoFrame) {
      this.texture.texImage2D(videoFrame)
      gl.activeTexture(gl.TEXTURE0)
      this.texture.bind()
      gl.uniformMatrix4fv(gl.uniforms.matrix, false, matrix)
      gl.uniform1i(gl.uniforms.isAlpha, this.props.isAlpha ? 1 : 0)

      const width = this.width
      const height = this.height
      drawVideo(this.getAttribBuffer(gl), width, height, this.props.isAlpha)

      gl.bindTexture(gl.TEXTURE_2D, null)
      gl.uniform1i(gl.uniforms.isAlpha, 0)
    }
  }

  destroy(gl?: ThisWebGLContext | undefined) {
    super.destroy(gl)
    this.texture?.destroy()
    this.texture = undefined
    this.decoder?.destroy()
    this.decoder = undefined
  }
}
