import {ThisWebGLContext, drawLineRect, drawVideo, m4} from '../base'
import MP4Decoder from '../base/decoder/MP4Decoder'
import Texture from '../base/webgl/Texture'
import {FrameInfo, LayerVideoProps} from '../types'
import AbstractDrawer from './AbstractDrawer'

function getFillCoord(texW: number, texH: number, dstW: number, dstH: number, alPha?: boolean, fillMode?: number) {
  let lx = 0
  let ly = 0
  let rx = alPha ? 0.5 : 1.0
  let ry = 1.0
  let sw = 1.0
  let sh = 1.0

  const srcW = alPha ? texW * 0.5 : texW
  const srcH = texH
  if (fillMode === 1) {
    const srcWhr = srcW / srcH
    const dstWhr = dstW / dstH
    const isLead = dstWhr < srcWhr
    const tw = isLead ? dstH * srcWhr : dstW
    const th = isLead ? dstH : dstW / srcWhr
    lx = (dstW - tw) * 0.5
    ly = (dstH - th) * 0.5
    lx = -lx / texW
    ly = -ly / th
    rx = rx - lx
    ry = ry - ly
  } else if (fillMode === 2) {
    // 默认拉伸
  } else {
    const srcWhr = srcW / srcH
    const dstWhr = dstW / dstH
    const isLead = dstWhr < srcWhr
    const tw = isLead ? dstW : dstH * srcWhr
    const th = isLead ? dstW / srcWhr : dstH
    sw = tw / dstW
    sh = th / dstH
  }

  return {lx, ly, rx, ry, sw, sh}
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

    const width = this.width
    const height = this.height
    const {lx, ly, rx, ry, sw, sh} = getFillCoord(
      this.videoWidth,
      this.videoHeigt,
      width,
      height,
      this.props.isAlpha,
      this.props.fillMode,
    )

    matrix = m4.translate(matrix, this.width * (1 - sw) * 0.5, -this.height * (1 - sh) * 0.5, 0)
    matrix = m4.scale(matrix, sw, sh, 1.0)
    gl.uniformMatrix4fv(gl.uniforms.matrix, false, matrix)
    gl.uniform1i(gl.uniforms.isAlpha, this.props.isAlpha ? 1 : 0)

    drawVideo(this.getAttribBuffer(gl), width, height, {lx, ly, rx, ry})

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
