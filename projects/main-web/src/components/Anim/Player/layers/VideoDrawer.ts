import {ThisWebGLContext, drawVideo, m4} from '../base'
import MP4Decoder from '../base/decoder/MP4Decoder'
import Texture from '../base/webgl/Texture'
import {FrameInfo, LayerVideoProps} from '../types'
import AbstractDrawer from './AbstractDrawer'

function getTexcoord(texW: number, texH: number, dstW: number, dstH: number, alPha?: boolean, fillMode?: number) {
  let lx = 0
  let ly = 0
  let rx = alPha ? 0.5 : 1.0
  let ry = 1.0
  const srcW = alPha ? texW * 0.5 : texW
  const srcH = texH
  // 长边对齐
  if (fillMode === 1) {
    const dr = srcH ? srcW / srcH : 0
    const isLead = dstW / dstH < dr
    const tw = isLead ? dstW : dstH * dr
    const th = !isLead ? dstH : dstW / dr
    lx = (dstW - tw) * 0.5
    ly = (dstH - th) * 0.5
    lx = -lx / texW
    ly = -ly / th
    rx = rx - lx
    ry = ry - ly
  } else if (fillMode === 2) {
    // 短边对齐
    const dr = srcW / srcH
    const isLead = dstW / dstH < dr
    const tw = !isLead ? dstW : dstH * dr
    const th = isLead ? dstH : dstW / dr
    lx = (dstW - tw) * 0.5
    ly = (dstH - th) * 0.5
    lx = -lx / texW
    ly = -ly / th
    rx = rx - lx
    ry = ry - ly
  }

  return {lx, ly, rx, ry}
}

export default class VideoDrawer extends AbstractDrawer<LayerVideoProps> {
  private texture?: Texture
  private videoWidth = 0
  private videoHeigt = 0
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

    const time = (frameInfo.frameId - this.inFrame) * this.playStore.frameTime
    this.decoder.seek(time)
    const videoFrame = this.decoder.videoFrame
    if (videoFrame) {
      this.texture.texImage2D(videoFrame)
      this.videoWidth = videoFrame.codedWidth
      this.videoHeigt = videoFrame.codedHeight
    }
    this.decoder.next()

    gl.activeTexture(gl.TEXTURE0)
    this.texture.bind()
    gl.uniformMatrix4fv(gl.uniforms.matrix, false, matrix)
    gl.uniform1i(gl.uniforms.isAlpha, this.props.isAlpha ? 1 : 0)

    const width = this.width
    const height = this.height
    const texcoord = getTexcoord(
      this.videoWidth,
      this.videoHeigt,
      width,
      height,
      this.props.isAlpha,
      this.props.fillMode,
    )
    drawVideo(this.getAttribBuffer(gl), width, height, texcoord)

    gl.bindTexture(gl.TEXTURE_2D, null)
    gl.uniform1i(gl.uniforms.isAlpha, 0)
  }

  destroy(gl?: ThisWebGLContext | undefined) {
    super.destroy(gl)
    this.texture?.destroy()
    this.texture = undefined
    this.decoder?.destroy()
    this.decoder = undefined
  }
}
